import { SeverityRequest, SeverityResponse } from '../interfaces/severity.interface';
import { analyzeSeverity } from './severity-engine';

export class SeverityService {
  async analyzeSeverity(request: SeverityRequest): Promise<SeverityResponse> {
    return analyzeSeverity(request);
  }
}
