export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Rounds a number to a given number of decimals.
 * @param decimals
 * @param number
 * @returns The rounded number or undefined if the input number is undefined.
 */
export function roundNumber(decimals: number, number?: number) {
  if (number === undefined) {
    return undefined;
  }
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
