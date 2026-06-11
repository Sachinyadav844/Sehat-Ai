import Joi from "joi";

export const processRequestSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
  conversationId: Joi.string().required(),
  language: Joi.string().default("en"),
  input: Joi.string().min(1).required(),
  metadata: Joi.object().optional(),
});

export const workflowStartSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
  conversationId: Joi.string().required(),
  language: Joi.string().default("en"),
  input: Joi.string().min(1).required(),
});

export const workflowContinueSchema = Joi.object({
  workflowId: Joi.string().required(),
  input: Joi.string().min(1).required(),
});
