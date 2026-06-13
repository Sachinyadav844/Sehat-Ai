import {SafetyLevel} from '../types';

export interface ClinicalRule {
  id: string;
  conditions: string[];
  description: string;
  outcome: SafetyLevel;
}

export const clinicalSafetyRules: ClinicalRule[] = [
  {
    id: 'chest-pain-breathlessness',
    conditions: ['chest pain', 'breathing difficulty', 'shortness of breath'],
    description: 'Chest pain combined with breathlessness indicates an emergency event.',
    outcome: 'EMERGENCY'
  },
  {
    id: 'unconsciousness',
    conditions: ['unconsciousness', 'loss of consciousness'],
    description: 'Any loss of consciousness is an emergency event.',
    outcome: 'EMERGENCY'
  },
  {
    id: 'stroke-indicators',
    conditions: ['facial drooping', 'arm weakness', 'slurred speech', 'stroke'],
    description: 'Stroke indicators require immediate emergency response.',
    outcome: 'EMERGENCY'
  },
  {
    id: 'persistent-high-fever',
    conditions: ['persistent high fever'],
    description: 'Persistent high fever is a high risk condition requiring careful monitoring.',
    outcome: 'CAUTION'
  },
  {
    id: 'severe-allergic-reaction',
    conditions: ['anaphylaxis', 'severe allergic reaction'],
    description: 'Severe allergic reaction is an emergency scenario.',
    outcome: 'EMERGENCY'
  }
];
