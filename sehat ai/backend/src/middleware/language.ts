import { Request, Response, NextFunction } from 'express';

export function languageMiddleware(req: Request, res: Response, next: NextFunction) {
  // Prefer explicit language in body or query, then Accept-Language header
  const fromBody = (req.body && (req.body.language || req.body.lang)) as string | undefined;
  const fromQuery = (req.query && (req.query.language || req.query.lang)) as string | undefined;
  const header = req.headers['accept-language'] as string | undefined;
  const lang = (fromBody || fromQuery || (header ? header.split(',')[0] : undefined) || 'en').split('-')[0];
  // store on res.locals for downstream handlers
  res.locals.lang = lang;
  next();
}
