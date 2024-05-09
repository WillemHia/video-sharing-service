import { spawnSync } from 'child_process';

const getVideoByUserId = (userId: string) => {
  const pythonProcess = spawnSync('python', ['./recommend.py', userId, 'user']);

  if (pythonProcess.error) {
    console.error(pythonProcess.error);
  } else {
    return pythonProcess.stdout.toString();
  }
};

export default getVideoByUserId;
