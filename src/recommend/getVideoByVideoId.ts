import { spawnSync } from 'child_process';

const getVideoByVideoId = (videoId: string) => {
  const pythonProcess = spawnSync('python', [
    './recommend.py',
    videoId,
    'video',
  ]);

  if (pythonProcess.error) {
    console.error(pythonProcess.error);
  } else {
    return pythonProcess.stdout.toString();
  }
};

export default getVideoByVideoId;
