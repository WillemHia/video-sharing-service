import pymysql
import sys
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
# 连接数据库


def connect_to_database():
    try:
        # 修改为你的数据库连接信息
        conn = pymysql.connect(
            host="localhost",
            user="root",
            password="123456",
            database="video_sharing",
            charset="utf8mb4",
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except Exception as e:
        return None


def get_video_data(conn):
    try:
        with conn.cursor() as cursor:
            # 使用 SQL 查询语句获取视频数据
            query = "SELECT id, introduce, label FROM video"
            cursor.execute(query)
            video_data = cursor.fetchall()
            # 将数据转化为列表
            video_data = [{'id': x['id'], 'introduce': x['introduce'],
                           'label': x['label']} for x in video_data]
            return video_data
    except Exception as e:
        return []

# 获取用户观看时长数据


def get_watch_data(conn):
    try:
        with conn.cursor() as cursor:
            # 使用 SQL 查询语句获取用户的观看时长数据
            query = "SELECT userId, videoId, progress FROM watch_history"
            cursor.execute(query)
            watch_data = cursor.fetchall()
        return watch_data
    except Exception as e:
        return []

# 获取用户搜索历史数据


def get_search_history(conn):
    try:
        with conn.cursor() as cursor:
            # 使用 SQL 查询语句获取用户的搜索历史数据
            query = "SELECT userId, content FROM search_history"
            cursor.execute(query)
            search_history = cursor.fetchall()
        return search_history
    except Exception as e:
        return []

# 获取用户交互行为数据


def get_interaction_data(conn):
    try:
        with conn.cursor() as cursor:
            # 使用 SQL 查询语句获取用户的交互行为数据
            query = "SELECT userId, videoId, interactionType FROM interaction"
            cursor.execute(query)
            interactions = cursor.fetchall()
        return interactions
    except Exception as e:
        return []

# 获取用户收藏行为数据


def get_collect_data(conn):
    try:
        with conn.cursor() as cursor:
            # 使用 SQL 查询语句获取用户的收藏行为数据
            query = "SELECT userId, videoId FROM collect"
            cursor.execute(query)
            collect_data = cursor.fetchall()
        return collect_data
    except Exception as e:
        return []

# 获取用户评论行为数据


def get_comment_data(conn):
    try:
        with conn.cursor() as cursor:
            # 使用 SQL 查询语句获取用户的评论行为数据
            query = "SELECT userId, videoId FROM comment"
            cursor.execute(query)
            comment_data = cursor.fetchall()
        return comment_data
    except Exception as e:
        return []

# 计算用户对视频的评分


def calculate_ratings(watch_data, search_history, interactions, collect_data, comment_data, conn):
    ratings = {}
    for watch in watch_data:
        # 观看时长评分
        watch_score = watch['progress'] * 4  # 观看时长占比为4分，假设totalTime的单位是秒
        ratings[(watch['userId'], watch['videoId'])] = watch_score
    for search in search_history:
        # 搜索行为评分
        # 在video表中查找包含搜索内容的视频,模糊查询
        with conn.cursor() as cursor:
            query = "SELECT id FROM video WHERE introduce LIKE %s or label LIKE %s"
            cursor.execute(
                query, ('%' + search['content'] + '%', '%' + search['content'] + '%'))
            search_results = cursor.fetchall()
            for result in search_results:
                video_id = result['id']
                search_score = 3
                ratings[(search['userId'], video_id)] = ratings.get(
                    (search['userId'], video_id), 0) + search_score

    for interaction in interactions:
        # 交互行为评分
        interaction_score = 1  # 交互行为占比为1分
        ratings[(interaction['userId'], interaction['videoId'])] = ratings.get(
            (interaction['userId'], interaction['videoId']), 0) + interaction_score

    for collect in collect_data:
        user_id, video_id = collect
        # 收藏行为评分
        collect_score = 1  # 收藏行为占比为1分
        ratings[(collect['userId'], collect['videoId'])] = ratings.get(
            (collect['userId'], collect['videoId']), 0) + collect_score

    for comment in comment_data:
        # 评论行为评分
        comment_score = 1  # 评论行为占比为1分
        ratings[(comment['userId'], comment['videoId'])] = ratings.get(
            (comment['userId'], comment['videoId']), 0) + comment_score

    return ratings

# 主函数


def get_video_by_userId(userId):
    conn = connect_to_database()
    if conn is None:
        return
    watch_data = get_watch_data(conn)
    search_history = get_search_history(conn)
    interactions = get_interaction_data(conn)
    collect_data = get_collect_data(conn)
    comment_data = get_comment_data(conn)

    ratings = calculate_ratings(
        watch_data, search_history, interactions, collect_data, comment_data, conn)

    conn.close()

    # 将ratings的健按照userId，videoId进行排序
    sorted_ratings = sorted(ratings.items(), key=lambda x: (x[0][0], x[0][1]))

    # 将格式转化为列表
    sorted_ratings = [{'userId': x[0][0], 'videoId': x[0]
                       [1], 'rating': x[1]} for x in sorted_ratings]

    # 直接将列表转化为DataFrame
    data = pd.DataFrame(sorted_ratings)

    # 2. 建立用户-物品矩阵
    user_item_matrix = pd.pivot_table(
        data, values='rating', index='userId', columns='videoId', fill_value=0)

    # 3. 训练KNN模型
    knn_model = NearestNeighbors(metric='cosine', algorithm='brute')
    knn_model.fit(user_item_matrix)

    # 4. 生成推荐
    def get_recommendations(user_id, k=5):
        try:
            user_index = user_item_matrix.index.get_loc(user_id)
        except KeyError:
            top_rated_videos = user_item_matrix.mean().sort_values(
                ascending=False).index.to_numpy()
            return top_rated_videos[:k]
        distances, indices = knn_model.kneighbors(
            [user_item_matrix.iloc[user_index]], n_neighbors=k+1)
        similar_users = indices.flatten()[1:]
        recommended_items = []
        for user in similar_users:
            items_rated_by_user = user_item_matrix.iloc[user][user_item_matrix.iloc[user] != 0].index
            for item in items_rated_by_user:
                if item not in user_item_matrix.iloc[user_index][user_item_matrix.iloc[user_index] != 0].index:
                    recommended_items.append(item)
        return recommended_items[:k]

    return get_recommendations(userId)


def get_video_by_videoId(videoId):
    conn = connect_to_database()
    if conn is None:
        return
    video_data = get_video_data(conn)
    conn.close()

    # 1. 读取评分数据和视频数据
    video_data = pd.DataFrame(video_data)

    # 2. 基于内容的推荐系统
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(
        video_data['label'] + ' ' + video_data['introduce'])
    content_similarity = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # 3. 生成推荐
    def get_similar_videos(video_id, k=3):
        video_index = video_data.index[video_data['id'] == video_id].tolist()[
            0]
        similar_videos = list(enumerate(content_similarity[video_index]))
        similar_videos = sorted(
            similar_videos, key=lambda x: x[1], reverse=True)
        similar_videos = similar_videos[1:k+1]
        similar_video_ids = [video_data.iloc[i[0]]['id']
                             for i in similar_videos]
        return similar_video_ids

    return get_similar_videos(videoId)


def get_video_by_rating(start):
    conn = connect_to_database()
    if conn is None:
        return
    watch_data = get_watch_data(conn)
    search_history = get_search_history(conn)
    interactions = get_interaction_data(conn)
    collect_data = get_collect_data(conn)
    comment_data = get_comment_data(conn)

    ratings = calculate_ratings(
        watch_data, search_history, interactions, collect_data, comment_data, conn)

    conn.close()

    # 将ratings的健按照userId，videoId进行排序
    sorted_ratings = sorted(ratings.items(), key=lambda x: (x[0][0], x[0][1]))

    # 将格式转化为列表
    sorted_ratings = [{'userId': x[0][0], 'videoId': x[0]
                       [1], 'rating': x[1]} for x in sorted_ratings]

    # 直接将列表转化为DataFrame
    data = pd.DataFrame(sorted_ratings)

    # 2. 建立用户-物品矩阵
    user_item_matrix = pd.pivot_table(
        data, values='rating', index='userId', columns='videoId', fill_value=0)

    top_rated_videos = user_item_matrix.mean().sort_values(
        ascending=False).index.to_numpy()
    return top_rated_videos[start:start+5]


if __name__ == "__main__":
    id = int(sys.argv[1])
    type = sys.argv[2]
    if type == 'user':
        print(get_video_by_userId(id))
    elif type == 'video':
        print(get_video_by_videoId(id))
    elif type == 'rating':
        print(get_video_by_rating(id))
    else:
        print("Invalid type")
        sys.exit(1)
