import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key-minimum-32-characters';
const IV_LENGTH = 16; // For AES, this is always 16 bytes

function ensureValidKey(key: string): Buffer {
  // AES-256 requires a 32-byte key
  if (key.length < 32) {
    // If the key is too short, pad it
    return Buffer.from(key.padEnd(32, '0'));
  } else if (key.length > 32) {
    // If the key is too long, truncate it
    return Buffer.from(key.slice(0, 32));
  }
  return Buffer.from(key);
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = ensureValidKey(ENCRYPTION_KEY);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  try {
    const textParts = text.split(':');
    if (textParts.length !== 2) {
      console.warn('Attempting to decrypt potentially unencrypted text');
      return text;
    }
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = Buffer.from(textParts[1], 'hex');
    const key = ensureValidKey(ENCRYPTION_KEY);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return text;
  }
}