import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';

export const formatVideoDuration = (duration: string): number => {
  // 00:00:00.000
  const [hour, minute, second] = duration.split(':');
  return +hour * 3600 + +minute * 60 + parseInt(second);
};

export const formatVideoUrl = (value: Video | Video[], req: Request) => {
  if (Array.isArray(value)) {
    return value.map((video) => {
      if (video.user) {
        video.user = formatUserAvatar(video.user, req);
      }
      return {
        ...video,
        url: `${req.protocol}://${req.headers.host}/videos/${video.url}`,
        poster: `${req.protocol}://${req.headers.host}/images/${video.poster}`,
      };
    });
  } else {
    if (value.user) {
      value.user = formatUserAvatar(value.user, req);
    }
    return {
      ...value,
      url: `${req.protocol}://${req.headers.host}/videos/${value.url}`,
      poster: `${req.protocol}://${req.headers.host}/images/${value.poster}`,
    };
  }
};

export const formatUserAvatar = (value: User, req: Request) => {
  const { password, ...result } = value;
  return {
    ...result,
    avatar: `${req.protocol}://${req.headers.host}/images/${value.avatar}`,
    backgroundImg: `${req.protocol}://${req.headers.host}/images/${value.backgroundImg}`,
  };
};
