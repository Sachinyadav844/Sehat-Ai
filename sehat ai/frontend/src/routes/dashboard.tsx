import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ensureArray } from '@/lib/utils';
import {
  Activity, ShieldAlert, Shield, Hospital, CalendarCheck, FileText,
  CheckCircle2, Sparkles, TrendingUp,
} from "lucide-react";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Live Agent Dashboard | Sehat AI" },
      { name: "description", content: "Real-time multi-agent activity, workflow timeline, risk monitoring and AI feed." },
      { property: "og:title", content: "Sehat AI Dashboard" },
      { property: "og:description", content: "Watch every AI agent reason in real-time." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPageWrapper() {
  // placeholder wrapper if we later add auth gating for admins
  return <DashboardPage />;
}

const agents = [
  { name: "Understanding Symptoms", task: "Parsing transcript", icon: Activity, progress: 92, confidence: 96, status: "active", responseTime: "240 ms" },
  { name: "Analyzing Condition", task: "Scoring risk", icon: ShieldAlert, progress: 78, confidence: 91, status: "active", responseTime: "180 ms" },
  { name: "Checking Risk", task: "Monitoring", icon: Shield, progress: 100, confidence: 99, status: "complete", responseTime: "60 ms" },
  { name: "Finding Nearby Care", task: "Searching nearby", icon: Hospital, progress: 65, confidence: 88, status: "active", responseTime: "320 ms" },
  { name: "Preparing Medical Summary", task: "Booking slot", icon: CalendarCheck, progress: 45, confidence: 84, status: "active", responseTime: "410 ms" },
  { name: "Finalizing Report", task: "Awaiting inputs", icon: FileText, progress: 12, confidence: 70, status: "idle", responseTime: "—" },
];

const timeline = [
  "Symptoms collected",
  "Fever detected",
  "Severity analyzed",
  "Hospital recommended",
  "Appointment booked",
  "Report generated",
];

const feed = [
  "Analyzing symptoms…",
  "Checking emergency risk…",
  "Searching nearest hospitals…",
  "Verifying doctor availability…",
  "Booking appointment…",
  "Generating AI report…",
];

const chartData = Array.from({ length: 12 }).map((_, i) => ({
  t: `${i + 1}m`,
  confidence: 70 + Math.round(Math.sin(i / 2) * 10 + i),
  severity: 50 + Math.round(Math.cos(i / 3) * 8 + i * 1.2),
}));

function DashboardPage() {
  const { t } = useTranslation(["common", "dashboard"]);
  const agentsFromTrans = ensureArray<any>(t("dashboard.agents", { returnObjects: true })) as any[];
  const timelineData = ensureArray<string>(t("dashboard.timeline", { returnObjects: true }));
  const feedData = ensureArray<string>(t("dashboard.feed", { returnObjects: true }));
  const timelineItems = timelineData.length && typeof timelineData[0] === "string" && !timelineData[0].startsWith("dashboard.") ? timelineData : timeline;
  const feedItems = feedData.length && typeof feedData[0] === "string" && !feedData[0].startsWith("dashboard.") ? feedData : feed;
  const agentItems = agentsFromTrans.length && typeof agentsFromTrans[0] === "object" ? agentsFromTrans : agents;
  return (
    <div className="bg-section min-h-[calc(100vh-4rem)] py-10">
      <div className="container mx-auto px-4">
        <SectionHeading
          align="left"
          eyebrow="Live Healthcare Monitoring"
          title="Track Your Consultation in Real Time"
          subtitle="Monitor live symptom analysis, consultation progress, emergency alerts, AI recommendations, and healthcare workflows instantly."
        />

        {/* Agent grid */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agentItems.map((a) => <AgentCard key={a.name} {...(a as any)} />)}
        </div>

        {/* Lower grid */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {/* Timeline */}
          <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
            <h3 className="font-semibold flex items-center gap-2 mb-5"><CheckCircle2 className="h-4 w-4 text-primary" /> {t('dashboard.workflowTimeline')}
            </h3>
            <ol className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {timelineItems.map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-3 relative"
                >
                  <span className="h-6 w-6 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">{t}</span>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Risk meter */}
          <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><ShieldAlert className="h-4 w-4 text-primary" /> {t('dashboard.riskMonitoring')}</h3>
            <div className="h-44">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "risk", value: 72, fill: "var(--color-warning)" }]} startAngle={210} endAngle={-30}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center -mt-32 mb-4">
              <div className="text-3xl font-bold text-warning">72</div>
              <div className="text-xs text-muted-foreground">{t('dashboard.severity')}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-xs mt-20">
              <div className="rounded-xl bg-section border border-border p-3">
                <div className="text-muted-foreground">{t('dashboard.emergency')}</div>
                <div className="text-success font-bold text-lg">12%</div>
              </div>
              <div className="rounded-xl bg-section border border-border p-3">
                <div className="text-muted-foreground">{t('dashboard.confidence')}</div>
                <div className="text-primary font-bold text-lg">93%</div>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
            <h3 className="font-semibold flex items-center gap-2 mb-5"><Sparkles className="h-4 w-4 text-primary" /> {t('dashboard.liveAIActivity')}</h3>
            <ul className="space-y-3">
              {feedItems.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-3 rounded-xl bg-mint border border-border px-3 py-2.5 text-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  {f}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Confidence chart */}
        <div className="mt-5 rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><TrendingUp className="h-4 w-4 text-primary" /> Confidence & Severity Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Line type="monotone" dataKey="confidence" stroke="var(--color-primary)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="severity" stroke="var(--color-warning)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
