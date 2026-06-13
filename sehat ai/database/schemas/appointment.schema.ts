export const AppointmentSchema = {
  type: 'object',
  properties: {
    appointmentId: { type: 'string' },
    hospitalId: { type: 'string' },
    doctorId: { type: 'string' },
    userId: { type: 'string' },
    bookingTime: { type: 'string', format: 'date-time' },
    status: { type: 'string' },
  },
  required: ['bookingTime'],
  additionalProperties: false,
} as const;
