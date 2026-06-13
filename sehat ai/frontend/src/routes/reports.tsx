import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, ShieldAlert, Pill, Stethoscope, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Medical Report | Sehat AI" },
      { name: "description", content: "Hospital-grade medical reports with comprehensive symptom analysis, severity assessment, clinical recommendations, and escalation protocols." },
      { property: "og:title", content: "Medical Report — Sehat AI" },
      { property: "og:description", content: "Professional medical report with clinical summary, severity analysis, and treatment recommendations." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { t } = useTranslation(["common", "reports"]);
  return (
    <div className="bg-section min-h-[calc(100vh-4rem)] py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded-3xl bg-card border border-border shadow-medical overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-primary text-primary-foreground p-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
                <FileText className="h-4 w-4" /> AI Clinical Reports
              </div>
              <h1 className="font-display text-3xl font-bold mt-2">Medical Reports Generated Instantly</h1>
              <div className="text-sm opacity-90 mt-1">{t('generated')}: SA-2026-04829 · {t('generatedDate', { date: 'May 23, 2026' })}</div>
            </div>
            <Button variant="secondary" className="rounded-full bg-background text-primary hover:bg-background/90">
              <Download className="h-4 w-4" /> {t('downloadPdf')}
            </Button>
          </div>

          <div className="p-8 space-y-8">
            <Grid2>
              <Field label={t('fields.patientName')} value={t('patientNameValue', 'Anonymous User')} />
              <Field label={t('fields.ageSex')} value={t('ageSexValue', '29 / Male')} />
              <Field label={t('fields.consultType')} value={t('consultTypeValue', 'AI Video — Real-Time')} />
              <Field label={t('fields.language')} value={t('languageValue', 'English')} />
            </Grid2>

            <Section icon={Stethoscope} title={t('patientSummaryTitle')}>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('patientSummary')}</p>
            </Section>

            <Section icon={ShieldAlert} title="Severity Analysis">
              <Grid2>
                <Stat label="Severity Score" value="72/100" tone="warning" />
                <Stat label="Emergency Probability" value="12%" tone="success" />
                <Stat label="Confidence" value="93%" tone="primary" />
                <Stat label="Recommended Specialist" value="General Physician" tone="primary" />
              </Grid2>
            </Section>

            <Section icon={Pill} title="Medicines Suggested">
              <ul className="text-sm space-y-1.5 list-disc pl-5">
                <li>Paracetamol 500 mg — every 6 hours as needed for fever.</li>
                <li>Lozenges — for sore throat relief.</li>
                <li>ORS / fluids — maintain hydration.</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground italic">Prescription should be confirmed by attending physician.</p>
            </Section>

            <Section icon={AlertTriangle} title="Precautions">
              <ul className="text-sm space-y-1.5 list-disc pl-5">
                <li>Isolate at home for 48–72 hours.</li>
                <li>Monitor temperature every 6 hours.</li>
                <li>Return to ER if breathlessness or chest pain develops.</li>
              </ul>
            </Section>

            <Section icon={FileText} title="Escalation Details">
              <div className="rounded-2xl bg-mint border border-border p-4 text-sm">
                Appointment auto-booked at <strong>City Care Hospital</strong> with <strong>Dr. Maria Khan</strong> today at <strong>3:30 PM</strong>. Estimated wait 12 minutes. Patient will receive SMS confirmation.
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-section border border-border p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-3 text-primary">
        <Icon className="h-5 w-5" /> {title}
      </h2>
      {children}
    </div>
  );
}
function Stat({ label, value, tone }: { label: string; value: string; tone: "primary" | "warning" | "success" }) {
  const colors = { primary: "text-primary", warning: "text-warning", success: "text-success" };
  return (
    <div className="rounded-2xl bg-section border border-border p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 text-xl font-bold ${colors[tone]}`}>{value}</div>
    </div>
  );
}
