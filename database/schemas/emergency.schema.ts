export const EmergencySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    consultationId: { type: 'string' },
    type: { type: 'string' },
    message: { type: 'string' },
    resolved: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['consultationId', 'type', 'message'],
  additionalProperties: false,
} as const;
