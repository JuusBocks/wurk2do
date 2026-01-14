/**
 * Encryption utilities using Web Crypto API (AES-GCM)
 * Provides end-to-end encryption for data stored in Google Drive
 */

/**
 * Derives an encryption key from a user identifier (email)
 * @param {string} userEmail - User's email address
 * @returns {Promise<CryptoKey>} - Derived encryption key
 */
async function deriveKey(userEmail) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userEmail),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Use a fixed salt derived from app name
  // In production, you might want to store this per-user
  const salt = encoder.encode('wurk2do-encryption-salt-v1');

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using AES-GCM encryption
 * @param {string} data - Plain text data to encrypt
 * @param {string} userEmail - User's email for key derivation
 * @returns {Promise<string>} - Encrypted data as base64 string
 */
export async function encryptData(data, userEmail) {
  try {
    const encoder = new TextEncoder();
    const key = await deriveKey(userEmail);
    
    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoder.encode(data)
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data using AES-GCM encryption
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @param {string} userEmail - User's email for key derivation
 * @returns {Promise<string>} - Decrypted plain text data
 */
export async function decryptData(encryptedData, userEmail) {
  try {
    const decoder = new TextDecoder();
    const key = await deriveKey(userEmail);
    
    // Convert from base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );

    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data - data may be corrupted or key mismatch');
  }
}

/**
 * Checks if data appears to be encrypted
 * @param {string} data - Data to check
 * @returns {boolean} - True if data appears encrypted
 */
export function isEncrypted(data) {
  try {
    // Encrypted data should be base64 and not valid JSON
    if (!data || typeof data !== 'string') return false;
    
    // Try to parse as JSON - if it works, it's not encrypted
    JSON.parse(data);
    return false;
  } catch {
    // If it's not valid JSON but looks like base64, it's likely encrypted
    return /^[A-Za-z0-9+/]+=*$/.test(data.trim());
  }
}

/**
 * Migrates unencrypted data to encrypted format
 * @param {string} data - Unencrypted JSON data
 * @param {string} userEmail - User's email for encryption
 * @returns {Promise<string>} - Encrypted data
 */
export async function migrateToEncrypted(data, userEmail) {
  if (isEncrypted(data)) {
    return data; // Already encrypted
  }
  return encryptData(data, userEmail);
}
