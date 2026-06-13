import jwt from 'jsonwebtoken';

export class TruGenTokenService {
  private apiSecret: string;

  constructor(apiSecret: string) {
    this.apiSecret = apiSecret;
  }

  generateSessionToken(sessionId: string, expiresIn: string = '1h'): string {
    return jwt.sign({ sessionId }, this.apiSecret || 'trugen-secret', {
      expiresIn,
    });
  }

  verifySessionToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, this.apiSecret || 'trugen-secret') as { sessionId: string };
      return decoded.sessionId;
    } catch (error) {
      return null;
    }
  }
}
