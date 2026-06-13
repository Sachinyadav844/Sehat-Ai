import { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import { logger } from "./logger";
import type Joi from "joi";

export function sanitizeRequest(req: Request, _res: Response, next: NextFunction): void {
  const sanitize = (value: unknown): unknown => {
    if (typeof value === "string") {
      return value.replace(/[<>\"'`;/]/g, "");
    }
    if (Array.isArray(value)) {
      return value.map((v) => sanitize(v));
    }
    if (value && typeof value === "object") {
      return Object.entries(value as Record<string, unknown>).reduce((acc, [key, v]) => {
        (acc as Record<string, unknown>)[key] = sanitize(v);
        return acc;
      }, {} as Record<string, unknown>);
    }
    return value;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query) as unknown as ParsedQs;
  req.params = sanitize(req.params) as unknown as ParamsDictionary;
  next();
}

export function validateInput(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      logger.warn("Validation failed", { errors: error.details });
      res.status(400).json({ message: "Invalid request payload", errors: error.details });
      return;
    }
    req.body = value as unknown;
    next();
  };
}
