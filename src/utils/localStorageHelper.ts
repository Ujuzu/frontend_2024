
import CryptoJS from 'crypto-js';
const MASTER_KEY: string = import.meta.env.VITE_MASTER_KEY || ''; // Use your own env key name

/**
 * Generate or retrieve a session salt.
 */
function getSalt(): string {
  const salt = localStorage.getItem('session_salt');
  if (!salt) {
    const randomSalt = CryptoJS.lib.WordArray.random(16).toString();
    localStorage.setItem('session_salt', randomSalt);
    return randomSalt;
  }
  return salt;
}

/**
 * Derive a session key from the MASTER_KEY and salt.
 */
function getSessionKey(): string {
  const salt = getSalt();
  const derivedKey = CryptoJS.PBKDF2(MASTER_KEY, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });
  return derivedKey.toString();
}

/**
 * Encrypts and stores a value in localStorage.
 */
export function setLocalStorage<T>(key: string, value: T): void {
  const sessionKey = getSessionKey();
  const stringValue = JSON.stringify(value);
  const encrypted = CryptoJS.AES.encrypt(stringValue, sessionKey).toString();
  localStorage.setItem(key, encrypted);
}

/**
 * Retrieves and decrypts a value from localStorage.
 */
export function getLocalstorage<T>(key: string): T | null {
  const sessionKey = getSessionKey();
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, sessionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return typeof decrypted === 'string' ? JSON.parse(decrypted) as T : decrypted;
    
  } catch (err) {
    console.error(`Decryption failed for key "${key}":`, err);
    return null;
  }
}


/**
 * Clears a specific key from localStorage.
 */
export function RemoveStorageItem(key: string): void {
  localStorage.removeItem(key);
}
/**
 * Clears the session salt (e.g., on logout).
 */
export function clearSessionKey(): void {
  localStorage.removeItem('session_salt');
}

export function emptyLocalStorage(): void {
  localStorage.clear(); 
}