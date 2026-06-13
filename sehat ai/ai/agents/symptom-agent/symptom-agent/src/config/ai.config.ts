import { OpenAI } from 'langchain/llms/openai';
import { env } from './env.js';

export function createOpenAIClient() {
  if (!env.openAiApiKey) {
    throw new Error('OPENAI_API_KEY is required for the Symptom Agent');
  }

  return new OpenAI({
    openAIApiKey: env.openAiApiKey,
    modelName: env.openAiModel,
    temperature: 0.2,
    maxTokens: 700,
  });
}
