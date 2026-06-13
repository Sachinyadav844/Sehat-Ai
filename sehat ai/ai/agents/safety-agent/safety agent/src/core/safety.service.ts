import {SafetyInput, SafetyOutput} from '../interfaces/safety';
import {SafetyEngine} from './safety-engine';

export class SafetyService {
  private readonly engine = new SafetyEngine();

  public async evaluateSafety(input: SafetyInput): Promise<SafetyOutput> {
    return this.engine.evaluateSafety(input);
  }
}
