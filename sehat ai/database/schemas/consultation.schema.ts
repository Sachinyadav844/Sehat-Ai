export const ConsultationSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    symptoms: { type: ['string', 'null'] },
    severity: { type: ['string', 'null'] },
    emergencyLevel: { type: ['string', 'null'] },
    transcript: { type: ['string', 'null'] },
    reportUrl: { type: ['string', 'null'] },
    status: { type: 'string' },
    language: { type: 'string' },
    startedAt: { type: ['string', 'null'], format: 'date-time' },
    endedAt: { type: ['string', 'null'], format: 'date-time' },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['userId', 'status', 'language'],
  additionalProperties: false,
} as const;
