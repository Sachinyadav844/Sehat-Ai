import { Router } from 'express';
import { signup, login, refreshToken, logout } from '../controllers/authController.js';

export const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/refresh', refreshToken);
authRouter.post('/logout', logout);
