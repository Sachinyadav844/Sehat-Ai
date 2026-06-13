export const HospitalSchema = {
  type: 'object',
  properties: {
    hospitalId: { type: 'string' },
    hospitalName: { type: 'string' },
    location: { type: 'string' },
    specialties: { type: ['string', 'null'] },
    emergencyAvailable: { type: 'boolean' },
    contact: { type: ['string', 'null'] },
  },
  required: ['hospitalName', 'location'],
  additionalProperties: false,
} as const;
