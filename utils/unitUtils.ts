/**
 * Converts a speed from meters per second (m/s) to kilometers per hour (km/h).
 *
 * @param {number} ms - The speed in meters per second.
 * @returns {number} The speed in kilometers per hour.
 */
export function msToKmh(ms: number): number {
  return ms * 3.6;
}
