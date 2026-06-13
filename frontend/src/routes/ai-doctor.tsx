import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Languages, Activity, ShieldAlert, AlertTriangle, Brain, Stethoscope, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import VideoAvatar from "@/components/VideoAvatar";
import { useTranslation } from "react-i18next";
import { ensureArray } from '@/lib/utils';

export const Route = createFileRoute("/ai-doctor")({
  head: () => ({
    meta: [
      { title: "AI Doctor — Live Consultation | Sehat AI" },
      { name: "description", content: "Real-time AI doctor with voice, video, and instant symptom analysis." },
      { property: "og:title", content: "AI Doctor — Sehat AI" },
      { property: "og:description", content: "Speak with an AI doctor in real-time." },
    ],
  }),
  component: AiDoctorPage,
});

function AiDoctorPage() {
  const { t, i18n } = useTranslation(["common", "ai"]);

  return (
    <>
      <section className="bg-gradient-mint py-12">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="24/7 AI Medical Assistant"
            title="Start Your Smart AI Consultation"
            subtitle="Speak naturally through voice, video, or chat while SehatAI understands symptoms and guides your healthcare journey in real time."
          />
        </div>
      </section>
      <div className="bg-section min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 grid gap-6 lg:grid-cols-3">
        {/* Video panel */}
        <div className="lg:col-span-2 rounded-3xl bg-card border border-border shadow-soft overflow-hidden flex flex-col">
          <div className="px-5 py-3 flex flex-col gap-3 border-b border-border bg-mint">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-destructive">{t('ai.liveStatus', 'Live')}</span>
                <span className="text-sm text-muted-foreground ml-2">{t('ai.doctorLabel', 'AI Doctor')} · 00:02:14</span>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5"><Languages className="h-4 w-4" /> {i18n.language}</Button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="rounded-full bg-background/80 px-3 py-2 text-foreground border border-border">Camera: Active</div>
              <div className="rounded-full bg-background/80 px-3 py-2 text-foreground border border-border">Microphone: Active</div>
              <div className="rounded-full bg-background/80 px-3 py-2 text-foreground border border-border">Status: Connected</div>
              <div className="rounded-full bg-background/80 px-3 py-2 text-foreground border border-border">Risk: Moderate</div>
            </div>
          </div>

          <div className="relative aspect-video bg-mint">
            {/* Yahan par sirf aapka TruGen ka Avatar ayega, faltu video box ya waves hata diye gaye hain */}
            <VideoAvatar consultationId="ai-doctor-session" avatarId="default-avatar" className="h-full" />
          </div>

          {/* Transcript */}
          <div className="p-5 border-t border-border bg-section">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" /> {t('ai.liveTranscript')}
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              <Bubble who={t('who.aiDoctor')} text={t('ai.sample.greeting')} />
              <Bubble who={t('who.you')} text={t('ai.sample.userSymptom')} mine />
              <Bubble who={t('who.aiDoctor')} text={t('ai.sample.followup')} />
              <Bubble who={t('who.you')} text={t('ai.sample.userReply')} mine />
            </div>
          </div>
        </div>

        {/* Analysis panel */}
        <div className="space-y-5">
          <Panel title={t('ai.panels.detectedSymptoms')} icon={Activity}>
            <div className="flex flex-wrap gap-2">
              {ensureArray<string>(t('ai.detected', { returnObjects: true })).map((s) => (
                <span key={s} className="rounded-full bg-mint text-primary text-xs font-medium px-3 py-1.5 border border-border">{s}</span>
              ))}
            </div>
          </Panel>

          <Panel title={t('ai.panels.severityScore')} icon={ShieldAlert}>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-warning">72<span className="text-base text-muted-foreground">/100</span></div>
                <div className="text-xs text-muted-foreground">{t('ai.severityLabel.moderate')}</div>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {t('ai.emergencyPrefix')}: <span className="text-destructive font-semibold">12%</span>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-mint overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ duration: 1 }} className="h-full bg-warning" />
            </div>
          </Panel>

          <Panel title={t('ai.panels.activeAgents')} icon={Brain}>
            <ul className="space-y-2.5">
              {[
                { name: t('agents.symptom'), status: t('agents.status.extracting') },
                { name: t('agents.severity'), status: t('agents.status.scoring') },
                { name: t('agents.safety'), status: t('agents.status.monitoring') },
                { name: t('agents.hospital'), status: t('agents.status.searching') },
              ].map((a) => (
                <li key={a.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    {a.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{a.status}…</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Reasoning Steps" icon={Stethoscope}>
            <ol className="space-y-2 text-sm">
              {["Identified upper respiratory symptoms", "Cross-referenced with seasonal viral patterns", "Estimated severity at moderate", "Recommending nearest GP within 3 km"].map((r, i) => (
                <li key={r} className="flex gap-2"><span className="text-primary font-bold">{i + 1}.</span><span className="text-muted-foreground">{r}</span></li>
              ))}
            </ol>
          </Panel>

          <div className="rounded-3xl border border-destructive/40 bg-destructive/5 p-5 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <div className="text-sm font-semibold text-destructive">Emergency Escalation</div>
              <div className="text-xs text-muted-foreground">Will auto-trigger if severity exceeds 90%.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card border border-border shadow-soft p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="grid place-items-center h-8 w-8 rounded-lg bg-mint text-primary"><Icon className="h-4 w-4" /></div>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Bubble({ who, text, mine }: { who: string; text: string; mine?: boolean }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${mine ? "bg-gradient-primary text-primary-foreground" : "bg-card border border-border"}`}>
        <div className={`text-[10px] uppercase mb-0.5 ${mine ? "text-primary-foreground/80" : "text-primary"}`}>{who}</div>
        {text}
      </div>
    </div>
  );
}