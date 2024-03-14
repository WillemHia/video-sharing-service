// eslint-disable-next-line
const { exec } = require('child_process');
const ffmpegPath = 'D:\\ffmpeg-6.1.1-full_build\\bin\\ffmpeg.exe';

export const getVideoDuration = async (videoPath: string): Promise<string> => {
  return await new Promise((resolve) => {
    exec(`${ffmpegPath} -i ${videoPath}`, (err: string) => {
      if (err) {
        const durationRegex = /Duration: ([\d:.]+)/;
        const match = durationRegex.exec(err);
        if (match && match[1]) {
          resolve(match[1]);
        }
        return;
      }
    });
  });
};

export const getVideoFirstFrame = async (
  videoPath: string,
): Promise<string> => {
  const post = `${new Date().getTime()}.jpg`;
  const url = `public/images/${post}`;
  return await new Promise((resolve) => {
    exec(`${ffmpegPath} -i ${videoPath} -vframes 1 ${url}`, () => {
      resolve(post);
    });
  });
};
