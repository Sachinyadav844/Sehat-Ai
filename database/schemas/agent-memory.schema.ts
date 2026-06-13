export const AgentMemorySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    consultationId: { type: 'string' },
    agentName: { type: 'string' },
    input: { type: 'string' },
    output: { type: 'string' },
    confidence: { type: 'number' },
    timestamp: { type: 'string', format: 'date-time' },
  },
  required: ['consultationId', 'agentName', 'input', 'output'],
  additionalProperties: false,
} as const;
