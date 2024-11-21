export function calculateAverageSpeed(speeds: number[]) {
  if (speeds.length === 0) {
    return 0;
  }

  let sum = speeds.reduce((acc, num) => acc + num, 0);
  return sum / speeds.length;
}
