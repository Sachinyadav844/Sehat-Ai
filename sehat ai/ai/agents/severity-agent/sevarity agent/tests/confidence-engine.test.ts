import { describe, expect, it } from 'vitest';
import { calculateConfidence, computeRequestQuality } from '../src/core/confidence-engine';

describe('Confidence Engine', () => {
  it('computes confidence with full quality and coverage', () => {
    expect(calculateConfidence(3, 3, 1, 1)).toBe(1);
  });

  it('computes confidence with partial matches and quality', () => {
    const score = calculateConfidence(2, 4, 0.75, 0.5);
    expect(score).toBeCloseTo(0.57, 2);
  });

  it('computes request quality from payload completeness', () => {
    expect(computeRequestQuality({ sessionId: '1', symptoms: [], duration: '1 day', age: 10, gender: 'female', language: 'en' })).toBe(1);
    expect(computeRequestQuality({ symptoms: ['fever'], duration: '1 day', age: 10, gender: 'female', language: 'en' } as any)).toBeCloseTo(0.83, 2);
  });
});
