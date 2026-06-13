import { prisma } from '../database/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

export const AuthService = {
  async signup(data: { email: string; password: string; name?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already in use');
    const hash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({ data: { email: data.email, password: hash, name: data.name } });
    return { id: user.id, email: user.email, name: user.name };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error('Invalid credentials');
    const access = jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, { expiresIn: ACCESS_EXPIRES });
    const refresh = jwt.sign({ sub: user.id }, config.jwtRefreshSecret, { expiresIn: REFRESH_EXPIRES });
    return { accessToken: access, refreshToken: refresh, user: { id: user.id, email: user.email, name: user.name } };
  },

  async refresh(refreshToken: string) {
    try {
      const payload: any = jwt.verify(refreshToken, config.jwtRefreshSecret);
      const userId = payload.sub;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('Invalid refresh token');
      const access = jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, { expiresIn: ACCESS_EXPIRES });
      return { accessToken: access };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  },

  async logout(refreshToken: string) {
    // In a production system store and revoke refresh tokens in DB/Redis. For now accept and rely on expiry.
    return true;
  }
}
