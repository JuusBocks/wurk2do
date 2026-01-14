/**
 * Data compression utilities using native browser APIs
 * Reduces payload size before encryption and upload
 */

/**
 * Compresses a string using gzip compression
 * @param {string} data - Data to compress
 * @returns {Promise<string>} - Base64 encoded compressed data
 */
export async function compressData(data) {
  try {
    // Convert string to Uint8Array
    const encoder = new TextEncoder();
    const dataArray = encoder.encode(data);

    // Create a compression stream (gzip)
    const stream = new Blob([dataArray]).stream();
    const compressedStream = stream.pipeThrough(
      new CompressionStream('gzip')
    );

    // Read the compressed data
    const compressedBlob = await new Response(compressedStream).blob();
    const compressedArray = new Uint8Array(await compressedBlob.arrayBuffer());

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...compressedArray));
  } catch (error) {
    console.warn('Compression failed, using uncompressed data:', error);
    return data; // Fallback to uncompressed if compression fails
  }
}

/**
 * Decompresses a gzip compressed string
 * @param {string} compressedData - Base64 encoded compressed data
 * @returns {Promise<string>} - Decompressed data
 */
export async function decompressData(compressedData) {
  try {
    // Convert from base64
    const compressedArray = Uint8Array.from(atob(compressedData), c => c.charCodeAt(0));

    // Create a decompression stream
    const stream = new Blob([compressedArray]).stream();
    const decompressedStream = stream.pipeThrough(
      new DecompressionStream('gzip')
    );

    // Read the decompressed data
    const decompressedBlob = await new Response(decompressedStream).blob();
    const decompressedArray = new Uint8Array(await decompressedBlob.arrayBuffer());

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decompressedArray);
  } catch (error) {
    console.warn('Decompression failed, trying as uncompressed:', error);
    return compressedData; // Fallback if data wasn't compressed
  }
}

/**
 * Checks if browser supports compression
 * @returns {boolean}
 */
export function isCompressionSupported() {
  return typeof CompressionStream !== 'undefined' && 
         typeof DecompressionStream !== 'undefined';
}

/**
 * Calculates compression ratio
 * @param {string} original - Original data
 * @param {string} compressed - Compressed data
 * @returns {number} - Compression ratio (0-1, lower is better)
 */
export function getCompressionRatio(original, compressed) {
  const originalSize = new Blob([original]).size;
  const compressedSize = new Blob([compressed]).size;
  return compressedSize / originalSize;
}
