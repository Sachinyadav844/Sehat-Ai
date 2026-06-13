import { AIOrchestratorService, OrchestrationResult } from '../../services/aiOrchestratorService.js';
import { config } from '../../config/index.js';
import { ConversationContext } from '../../types/consultation.js';

export class AIGatewayService {
  private orchestrator = new AIOrchestratorService(config.aiServiceUrl);

  async sendTranscript(
    consultationId: string,
    transcript: string,
    language: string,
    history: { id: string; speaker: 'patient' | 'ai' | 'system'; text: string; language: string; timestamp: Date }[] = []
  ): Promise<OrchestrationResult> {
    const context: ConversationContext = {
      consultationId,
      language,
      symptoms: [],
      riskLevel: 'unknown',
      history:
        history.length > 0
          ? history
          : [
              {
                id: 'initial',
                speaker: 'patient',
                text: transcript,
                language,
                timestamp: new Date(),
              },
            ],
      metadata: {},
    };

    return this.orchestrator.orchestrateConsultation(context);
  }
}
