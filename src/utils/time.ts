export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00:00"; // Default display for invalid or negative durations
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num: number): string => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};
