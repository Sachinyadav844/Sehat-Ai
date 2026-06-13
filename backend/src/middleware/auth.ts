import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface AuthRequest extends Request {
  user?: any;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ ok: false, message: 'Missing token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload: any = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ ok: false, message: 'Invalid token' });
  }
}
