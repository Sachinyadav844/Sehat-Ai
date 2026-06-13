import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { OpenAI } from '@langchain/openai';
import { symptomExtractionPrompt } from './prompts.js';
import { env } from '../config/env.js';

// Provide a safe fallback chain when OpenAI/GPT key isn't configured.
class FallbackChain {
  async call(_args: Record<string, unknown>) {
    // Minimal safe JSON output matching expected schema.
    const payload = {
      summary: { primarySymptoms: ['symptoms'], duration: 'unknown', severityHint: 'unknown' },
      followUpQuestions: ['Can you tell me more about your symptoms?'],
      emergencySignals: false,
      conversationStage: 'follow-up',
    };
    return { text: JSON.stringify(payload) };
  }
}

const promptTemplate = new PromptTemplate({
  template: symptomExtractionPrompt,
  inputVariables: ['message', 'sessionContext', 'history', 'language'],
});

export function createSymptomExtractionChain() {
  if (!env.openAiApiKey) {
    return new FallbackChain() as any;
  }

  try {
    const llm = new OpenAI({
      openAIApiKey: env.openAiApiKey,
      modelName: env.openAiModel,
      temperature: 0.2,
      maxTokens: 700,
    });

    return new LLMChain({
      llm: llm as any,
      prompt: promptTemplate,
    });
  } catch (_error) {
    // Fallback if OpenAI initialization fails
    return new FallbackChain() as any;
  }
}
