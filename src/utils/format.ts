export const formatVideoDuration = (duration: string): number => {
  // 00:00:00.000
  const [hour, minute, second] = duration.split(':');
  return +hour * 3600 + +minute * 60 + parseInt(second);
};
