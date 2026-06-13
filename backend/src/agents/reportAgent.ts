export class ReportAgent {
  async run({ consultationId, symptoms, risk, hospitals, appointment }: any) {
    // Generate textual report summary (in production call LLM / RAG)
    const summary = `Consultation ${consultationId}: symptoms ${JSON.stringify(symptoms)}. Risk ${JSON.stringify(risk)}. Recommended ${hospitals?.[0]?.name || 'N/A'}. Appointment ${appointment?.id || 'none'}.`;
    return { id: `rpt-${Date.now()}`, consultationId, summary, text: summary, pdfUrl: null };
  }
}
