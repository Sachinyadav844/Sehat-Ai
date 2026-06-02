import { Server } from 'socket.io';
import axios from 'axios';
import { SymptomAgent } from './symptomAgent.js';
import { SeverityAgent } from './severityAgent.js';
import { SafetyAgent } from './safetyAgent.js';
import { HospitalAgent } from './hospitalAgent.js';
import { AppointmentAgent } from './appointmentAgent.js';
import { ReportAgent } from './reportAgent.js';
import { prisma } from '../database/client.js';

export class Orchestrator {
  io: Server;
  constructor(io: Server) {
    this.io = io;
  }

  async handleTranscript(payload: any) {
    const { consultationId, text, language } = payload;
    // Step 1: symptom extraction
    const symptomAgent = new SymptomAgent();
    const symptoms = await symptomAgent.run({ text, language });
    this.io.to(consultationId).emit('consultation:agent-update', { agent: 'symptom', data: symptoms });

    // Step 2: severity
    const severityAgent = new SeverityAgent();
    const risk = await severityAgent.run({ symptoms });
    this.io.to(consultationId).emit('consultation:risk-update', risk);

    // Step 3: safety
    const safetyAgent = new SafetyAgent();
    const safety = await safetyAgent.run({ text, symptoms, risk });
    this.io.to(consultationId).emit('consultation:agent-update', { agent: 'safety', data: safety });

    if (safety.escalate) {
      this.io.to(consultationId).emit('consultation:emergency-alert', { message: safety.message });
      // also store emergency event
      await prisma.emergencyEvent.create({ data: { consultationId, type: 'safety', message: safety.message } });
      return;
    }

    // Step 4: hospital recommendation
    const hospitalAgent = new HospitalAgent();
    const hospitals = await hospitalAgent.run({ symptoms, location: payload.location });
    this.io.to(consultationId).emit('consultation:hospital-update', hospitals);

    // Step 5: appointment suggestion / booking (deferred)
    const appointmentAgent = new AppointmentAgent();
    const appointment = await appointmentAgent.run({ hospitals, consultationId });
    this.io.to(consultationId).emit('consultation:appointment-update', appointment);

    // Step 6: report generation
    const reportAgent = new ReportAgent();
    const report = await reportAgent.run({ consultationId, symptoms, risk, hospitals, appointment });
    this.io.to(consultationId).emit('consultation:report-update', report);

    // localized report event (use translation service to produce localized text)
    try {
      const { translateText } = await import('../services/translationService.js');
      const localized = await translateText(report.text || report.summary || '', language);
      this.io.to(consultationId).emit('consultation:localized-report', { ...report, localized });
    } catch (err) {
      this.io.to(consultationId).emit('consultation:localized-report', { ...report, localized: { text: report.text || report.summary || '', translated: false, targetLang: language } });
    }

    // persist agent logs
    await prisma.agentLog.createMany({ data: [
      { consultationId, agentName: 'symptom', payload: JSON.stringify(symptoms) },
      { consultationId, agentName: 'severity', payload: JSON.stringify(risk) },
      { consultationId, agentName: 'safety', payload: JSON.stringify(safety) },
    ] });
  }
}
