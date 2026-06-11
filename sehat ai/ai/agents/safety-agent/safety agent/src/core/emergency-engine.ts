import {SeverityResult} from '../interfaces/safety';
import {evaluateEmergency, EmergencyDetectionResult} from '../emergency/emergency-engine';

export class CoreEmergencyEngine {
  detect(symptoms: string[], severityResult: SeverityResult): EmergencyDetectionResult {
    return evaluateEmergency(symptoms, severityResult);
  }
}
