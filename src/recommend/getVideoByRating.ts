import { spawnSync } from 'child_process';

const getVideoByRating = (start: string) => {
  const pythonProcess = spawnSync('python', [
    './recommend.py',
    start,
    'rating',
  ]);

  if (pythonProcess.error) {
    console.error(pythonProcess.error);
  } else {
    return pythonProcess.stdout.toString();
  }
};

export default getVideoByRating;
