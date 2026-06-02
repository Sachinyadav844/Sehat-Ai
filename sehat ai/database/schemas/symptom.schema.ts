export const SymptomSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    consultationId: { type: 'string' },
    name: { type: 'string' },
    duration: { type: ['string', 'null'] },
    severity: { type: ['string', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['consultationId', 'name'],
  additionalProperties: false,
} as const;
