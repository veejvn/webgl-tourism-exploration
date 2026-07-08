import * as crypto from 'crypto';

const JWT_SECRET =
  process.env.JWT_SECRET || 'tourism-3d-secret-key-super-secure';

export class JwtHelper {
  static sign(payload: any, expiresInSeconds: number = 86400): string {
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

      if (signature !== expectedSignature) return null;

      const payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      );
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        return null; // Expired
      }

      return payload;
    } catch {
      return null;
    }
  }
}
