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

/**
 * Converts a number to a string if it is not undefined or NaN.
 * @param num The number to convert to a string.
 * @returns The number as a string or undefined if the number is undefined or NaN.
 */
export function toStr(num?: number) {
  if (num !== undefined && !isNaN(num)) {
    return num.toString();
  }
  return undefined;
}
