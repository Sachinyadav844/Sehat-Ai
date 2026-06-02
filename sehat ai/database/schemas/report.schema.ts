export const ReportSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    consultationId: { type: 'string' },
    summary: { type: 'string' },
    medications: { type: ['string', 'null'] },
    riskLevel: { type: ['string', 'null'] },
    generatedAt: { type: 'string', format: 'date-time' },
    pdfUrl: { type: ['string', 'null'] },
  },
  required: ['consultationId', 'summary'],
  additionalProperties: false,
} as const;
