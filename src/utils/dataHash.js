/**
 * Data hashing utilities for change detection
 * Prevents unnecessary uploads when data hasn't changed
 */

/**
 * Generates a hash of the data using SHA-256
 * @param {string} data - Data to hash
 * @returns {Promise<string>} - Hex string hash
 */
export async function hashData(data) {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Hashing failed:', error);
    return null;
  }
}

/**
 * Compares two data objects by hashing
 * @param {Object} data1 - First data object
 * @param {Object} data2 - Second data object
 * @returns {Promise<boolean>} - True if data is identical
 */
export async function dataIsIdentical(data1, data2) {
  try {
    const hash1 = await hashData(JSON.stringify(data1));
    const hash2 = await hashData(JSON.stringify(data2));
    return hash1 === hash2;
  } catch (error) {
    console.error('Data comparison failed:', error);
    return false;
  }
}

/**
 * Calculates a simple checksum for quick comparison
 * Faster than full hash, use for initial checks
 * @param {Object} data - Data to checksum
 * @returns {string} - Checksum string
 */
export function quickChecksum(data) {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}
