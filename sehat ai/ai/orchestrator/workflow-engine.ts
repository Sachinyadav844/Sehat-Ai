import { Logger } from "../shared/logger";
import { EventBus } from "../shared/event-system/event-bus";
import { ExecutionEngine } from "./execution-engine";
import { StateManager } from "./state-manager";
import { LanguageAgent } from "../agents/language-agent/service";
import { SymptomAgent } from "../agents/symptom-agent/service";
import { SeverityAgent } from "../agents/severity-agent/service";
import { SafetyAgent } from "../agents/safety-agent/service";
import { EmergencyAgent } from "../agents/emergency-agent/service";
import { HospitalAgent } from "../agents/hospital-agent/service";
import { AppointmentAgent } from "../agents/appointment-agent/service";
import { ReportAgent } from "../agents/report-agent/service";
import { MemoryAgent } from "../agents/memory-agent/service";
import { AuditAgent } from "../agents/audit-agent/service";
import type { WorkflowState } from "./state-manager";
import type { DashboardEvent } from "../shared/message-schema";

export interface PatientWorkflowInput {
  requestId: string;
  userId: string;
  text: string;
  location?: string;
  language?: string;
}

export interface PatientWorkflowOutput {
  requestId: string;
  symptomProfile: unknown;
  severityClassification: unknown;
  safetyResult: unknown;
  emergencyResult: unknown;
  hospitalRecommendations: unknown[];
  appointment: unknown;
  report: unknown;
  language: string;
}

export class WorkflowEngine {
  private eventBus: EventBus;
  private execution = new ExecutionEngine();
  private stateManager = new StateManager();

  private languageAgent = new LanguageAgent();
  private symptomAgent = new SymptomAgent();
  private severityAgent = new SeverityAgent();
  private safetyAgent = new SafetyAgent();
  private emergencyAgent = new EmergencyAgent();
  private hospitalAgent = new HospitalAgent();
  private appointmentAgent = new AppointmentAgent();
  private reportAgent = new ReportAgent();
  private memoryAgent = new MemoryAgent();
  private auditAgent = new AuditAgent();

  constructor(eventBus?: EventBus) {
    this.eventBus = eventBus ?? new EventBus();
  }

  private async publishEvent(type: DashboardEvent["type"], payload: Record<string, unknown>, sourceAgent: string) {
    const event: DashboardEvent = {
      type,
      sourceAgent,
      payload,
      timestamp: new Date().toISOString()
    };
    await this.eventBus.publish("dashboard_events", event);
  }

  async process(input: PatientWorkflowInput): Promise<PatientWorkflowOutput> {
    const state = this.stateManager.create(input.requestId);
    try {
      Logger.info(`Starting workflow for request ${input.requestId}`, "WorkflowEngine");
      await this.publishEvent("agent_started", { requestId: input.requestId }, "WorkflowEngine");
      this.stateManager.update(input.requestId, { stage: "language" });

      const languageResult = await this.execution.execute(
        () => this.languageAgent.execute({ text: input.text, language: input.language ?? "en" }),
        { timeoutMs: 7000, retries: 1 }
      );
      this.stateManager.update(input.requestId, { context: { language: languageResult.language } });

      const symptomProfile = await this.execution.execute(
        () => this.symptomAgent.execute({ text: input.text, language: languageResult.language, history: [] }),
        { timeoutMs: 12000, retries: 1 }
      );
      this.stateManager.update(input.requestId, { stage: "symptom" });
      await this.publishEvent("agent_completed", { requestId: input.requestId, agent: "SymptomAgent" }, "SymptomAgent");

      const severityResult = await this.execution.execute(
        () => this.severityAgent.execute(symptomProfile),
        { timeoutMs: 7000, retries: 1 }
      );
      this.stateManager.update(input.requestId, { stage: "severity" });
      await this.publishEvent("risk_detected", { requestId: input.requestId, severity: severityResult.severity }, "SeverityAgent");

      const safetyResult = await this.execution.execute(
        () => this.safetyAgent.execute({ symptomProfile, severityResult }),
        { timeoutMs: 7000, retries: 1 }
      );
      this.stateManager.update(input.requestId, { stage: "safety" });
      await this.publishEvent("agent_completed", { requestId: input.requestId, agent: "SafetyAgent" }, "SafetyAgent");

      const emergencyResult = await this.execution.execute(
        () => this.emergencyAgent.execute({ symptomProfile, severityResult, safetyResult }),
        { timeoutMs: 7000, retries: 1 }
      );
      this.stateManager.update(input.requestId, { stage: "emergency" });
      if (emergencyResult.emergencyDetected) {
        await this.publishEvent("emergency_detected", { requestId: input.requestId, emergencyType: emergencyResult.emergencyType }, "EmergencyAgent");
      }

      const riskLevel = String(severityResult.severity ?? "UNKNOWN");
      const hospitalRecommendations = await this.execution.execute(
        () => this.hospitalAgent.execute({ location: input.location ?? "unknown", disease: symptomProfile.disease ?? "unknown", riskLevel }),
        { timeoutMs: 9000, retries: 1 }
      );
      this.stateManager.update(input.requestId, { stage: "hospital" });

      const appointment = await this.execution.execute(
        () => this.appointmentAgent.execute({ patientId: input.userId, hospitalRecommendations, symptomProfile, riskLevel }),
        { timeoutMs: 9000, retries: 1 }
      );
      this.stateManager.update(input.requestId, { stage: "appointment" });
      await this.publishEvent("appointment_created", { requestId: input.requestId, appointmentId: appointment.appointmentId }, "AppointmentAgent");

      const report = await this.execution.execute(
        () => this.reportAgent.execute({
          patientId: input.userId,
          symptomProfile,
          severityResult,
          safetyResult,
          emergencyResult,
          hospitalRecommendations,
          appointment,
        }),
        { timeoutMs: 10000, retries: 1 }
      );
      this.stateManager.update(input.requestId, { stage: "report" });
      await this.publishEvent("report_generated", { requestId: input.requestId, reportId: report.reportId }, "ReportAgent");

      const memoryResult = await this.memoryAgent.execute({
        requestId: input.requestId,
        userId: input.userId,
        input: input.text,
        symptomProfile,
        severityResult,
        safetyResult,
        emergencyResult,
        hospitalRecommendations,
        appointment,
        report,
      });

      const auditResult = await this.auditAgent.execute({
        requestId: input.requestId,
        userId: input.userId,
        symptomProfile,
        severityResult,
        safetyResult,
        emergencyResult,
        appointment,
        report,
      });
      await this.publishEvent("audit_logged", { requestId: input.requestId, auditId: auditResult.auditId }, "AuditAgent");

      this.stateManager.update(input.requestId, { stage: "completed", context: { language: languageResult.language } });
      await this.publishEvent("agent_completed", { requestId: input.requestId, agent: "WorkflowEngine" }, "WorkflowEngine");

      return {
        requestId: input.requestId,
        symptomProfile,
        severityClassification: severityResult,
        safetyResult,
        emergencyResult,
        hospitalRecommendations,
        appointment,
        report,
        language: languageResult.language
      };
    } catch (error) {
      Logger.error(`Workflow failed for request ${input.requestId}: ${(error as Error).message}`, "WorkflowEngine", error as Error);
      this.stateManager.update(input.requestId, { stage: "failed" });
      throw error;
    }
  }

  getState(requestId: string): WorkflowState | undefined {
    return this.stateManager.get(requestId);
  }
}
