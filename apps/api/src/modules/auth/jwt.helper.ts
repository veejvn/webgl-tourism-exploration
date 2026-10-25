import * as crypto from 'crypto';

// Fail fast at startup when the secret is missing instead of silently
// falling back to a publicly-known key
function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET is not set. Add it to apps/api/.env before starting the server.',
    );
  }
  return secret;
}

const JWT_SECRET = getSecret();

const TOKEN_TTL_SECONDS = 86400; // 24h

export class JwtHelper {
  static sign(payload: any, expiresInSeconds: number = TOKEN_TTL_SECONDS): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const fullPayload = { ...payload, exp };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      'base64url',
    );
    const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString(
      'base64url',
    );

    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static verify(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [encodedHeader, encodedPayload, signature] = parts;
      const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');

      const sigBuf = Buffer.from(signature);
      const expectedBuf = Buffer.from(expectedSignature);
      if (sigBuf.length !== expectedBuf.length) return null;
      if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

      const payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      );

      // Tokens without an expiry claim are rejected
      if (
        typeof payload.exp !== 'number' ||
        Date.now() / 1000 > payload.exp
      ) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }
}
