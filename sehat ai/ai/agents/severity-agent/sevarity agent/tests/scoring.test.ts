import { describe, expect, it } from 'vitest';
import { scoreSymptoms } from '../src/scoring/symptom-scorer';
import { collectEmergencySymptoms, isEmergencySymptom } from '../src/scoring/emergency-scorer';
import { scoreDiseaseSignature } from '../src/scoring/disease-scorer';

describe('Scoring Modules', () => {
  it('scores symptoms and returns matched and unmatched items', () => {
    const result = scoreSymptoms(['fever', 'unknown symptom', 'cough']);
    expect(result.score).toBeGreaterThan(0);
    expect(result.matched).toContain('fever');
    expect(result.unmatched).toContain('unknown symptom');
  });

  it('detects emergency symptoms correctly', () => {
    expect(isEmergencySymptom('Chest Pain')).toBe(true);
    expect(isEmergencySymptom('cough')).toBe(false);
    expect(collectEmergencySymptoms(['chest pain', 'cough'])).toEqual(['chest pain']);
  });

  it('returns null for unknown disease signatures', () => {
    expect(scoreDiseaseSignature('unknown')).toBeNull();
    expect(scoreDiseaseSignature('pneumonia')).toEqual({ condition: 'pneumonia', severityIndex: 70 });
  });
});
