import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

export async function signup(req: Request, res: Response) {
  try {
    const user = await AuthService.signup(req.body);
    res.json({ ok: true, user });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const tokens = await AuthService.login(req.body.email, req.body.password);
    res.json({ ok: true, ...tokens });
  } catch (err: any) {
    res.status(401).json({ ok: false, message: err.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const token = await AuthService.refresh(req.body.refreshToken);
    res.json({ ok: true, token });
  } catch (err: any) {
    res.status(401).json({ ok: false, message: err.message });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    await AuthService.logout(req.body.refreshToken);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
}
