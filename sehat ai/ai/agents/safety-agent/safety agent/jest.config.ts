import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  }
};

export default config;
