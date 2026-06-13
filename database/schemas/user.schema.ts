export const UserSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    age: { type: 'integer' },
    gender: { type: 'string' },
    language: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
} as const;
