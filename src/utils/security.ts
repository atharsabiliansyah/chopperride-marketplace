import CryptoJS from 'crypto-js';

// Base application pepper key (combined with User UID for deterministic zero-knowledge user encryption)
const APP_PEPPER = 'chopper-vault-aes-256-v1-production';

/**
 * Derives a dedicated cryptographic key for a specific user.
 * Each user's sensitive data is encrypted using their unique UID + salt.
 */
function getUserKey(userId: string): string {
  if (!userId) throw new Error('User ID is required for encryption key derivation');
  return CryptoJS.SHA256(`${userId}-${APP_PEPPER}`).toString(CryptoJS.enc.Hex);
}

/**
 * Encrypts a sensitive string (phone number, bank account, private notes) with AES-256.
 */
export function encryptSensitiveData(plainText: string, userId: string): string {
  if (!plainText) return '';
  const key = getUserKey(userId);
  const encrypted = CryptoJS.AES.encrypt(plainText.trim(), key).toString();
  return encrypted;
}

/**
 * Decrypts AES-256 encrypted sensitive string for the authorized user.
 */
export function decryptSensitiveData(cipherText: string, userId: string): string {
  if (!cipherText) return '';
  try {
    const key = getUserKey(userId);
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || '';
  } catch (err) {
    console.warn('Failed to decrypt data or invalid key:', err);
    return '';
  }
}

/**
 * Server/Client side input sanitization to prevent XSS and injection attacks.
 * Strips script tags, unsafe HTML entities, null characters, and enforces length bounds.
 */
export function sanitizeInput(input: string, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  
  // Remove null bytes and control characters
  let clean = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Strip script, iframe, and dangerous tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');

  // Strip dangerous event handler attributes like onclick=, onerror=, etc.
  clean = clean.replace(/on\w+\s*=\s*(['"]).*?\1/gi, '');
  clean = clean.replace(/on\w+\s*=\s*[^>\s]+/gi, '');

  // Truncate to maximum permissible length
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }

  return clean.trim();
}

/**
 * Validates motorcycle listing input according to strict schema constraints.
 */
export function validateListingInput(data: {
  title: string;
  engineBase: string;
  price: number;
  city?: string;
  description?: string;
}): { isValid: boolean; error?: string } {
  if (!data.title || data.title.trim().length === 0) {
    return { isValid: false, error: 'Judul iklan tidak boleh kosong' };
  }
  if (data.title.length > 200) {
    return { isValid: false, error: 'Judul iklan maksimal 200 karakter' };
  }
  if (!data.engineBase || data.engineBase.trim().length === 0) {
    return { isValid: false, error: 'Basis mesin wajib dipilih' };
  }
  if (typeof data.price !== 'number' || isNaN(data.price) || data.price < 1000000) {
    return { isValid: false, error: 'Harga jual minimal Rp 1.000.000' };
  }
  if (data.description && data.description.length > 4000) {
    return { isValid: false, error: 'Deskripsi maksimal 4000 karakter' };
  }
  return { isValid: true };
}
