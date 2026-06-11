import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/interfaces/**',
        'src/emergency/**',
        'src/rag/**',
        'src/types/**',
        'src/server.ts',
        'src/models/severity.model.ts',
        'src/rules/index.ts',
        'src/datasets/**'
      ]
    }
  }
});
