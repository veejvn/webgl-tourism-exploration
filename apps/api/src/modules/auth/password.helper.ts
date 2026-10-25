import * as crypto from 'crypto';

// scrypt params (OWASP-recommended minimum for interactive logins)
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;
export const SCRYPT_PREFIX = 'scrypt:';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return `${SCRYPT_PREFIX}${salt.toString('hex')}:${hash.toString('hex')}`;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Legacy unsalted SHA-256 (pre-scrypt accounts)
function legacySha256(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function isScryptHash(stored: string): boolean {
  return stored.startsWith(SCRYPT_PREFIX);
}

export function legacyVerify(password: string, storedHash: string): boolean {
  return timingSafeEqualHex(legacySha256(password), storedHash);
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored.startsWith(SCRYPT_PREFIX)) return false;

  const parts = stored.slice(SCRYPT_PREFIX.length).split(':');
  if (parts.length !== 2) return false;

  const [saltHex, hashHex] = parts;
  let salt: Buffer;
  try {
    salt = Buffer.from(saltHex, 'hex');
  } catch {
    return false;
  }

  const hash = crypto.scryptSync(password, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return timingSafeEqualHex(hash.toString('hex'), hashHex);
}
