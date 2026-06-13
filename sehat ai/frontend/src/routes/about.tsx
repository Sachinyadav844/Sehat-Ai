import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Globe, Brain, Sparkles, Hospital, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useTranslation } from "react-i18next";
import team from "@/assets/team-doctors.jpg";
import illo from "@/assets/about-illustration.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Sehat AI — Our Mission" },
      { name: "description", content: "Healthcare accessibility for everyone through multi-agent AI." },
      { property: "og:title", content: "About Sehat AI" },
      { property: "og:description", content: "Our mission: AI-powered healthcare for urban and rural communities." },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { v: "10+", l: "AI Agents" },
  { v: "50k+", l: "Consultations" },
  { v: "98%", l: "Accuracy" },
  { v: "12 lang", l: "Supported" },
];

function AboutPage() {
  const { t } = useTranslation(["common", "about"]);
  const stats = [
    { v: "10+", l: t('stats.aiAgents') },
    { v: "50k+", l: t('stats.consultations') },
    { v: "98%", l: t('stats.accuracy') },
    { v: "12 lang", l: t('stats.supported') },
  ];
  return (
    <div>
      <section className="bg-gradient-mint py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Future of Digital Healthcare"
            title="Building Accessible AI Healthcare for Everyone"
            subtitle="SehatAI combines autonomous healthcare intelligence, multilingual communication, and real-time workflows to support underserved communities."
          />
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <img src={team} alt="Sehat AI team" loading="lazy" width={1280} height={800} className="rounded-[2rem] border border-border shadow-medical" />
          <div className="space-y-5">
            <h2 className="font-display text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">To bring world-class healthcare intelligence within reach of every person — from city hospitals to rural villages — using a cooperative network of AI agents that reason like real doctors.</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((s) => (
                <div key={s.l} className="rounded-2xl bg-section border border-border p-4 text-center">
                  <div className="text-2xl font-bold text-gradient">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-section">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="Pillars" title="What drives us" />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: ShieldCheck, title: "Healthcare Accessibility", text: "No queue, no distance — just instant intelligent care." },
              { icon: Globe, title: "Rural Healthcare Support", text: "Reach communities where specialists are scarce." },
              { icon: Brain, title: "Multi-Agent Architecture", text: "Ten agents reasoning, validating and acting together." },
              { icon: Sparkles, title: "Future of Medicine", text: "AI as a partner — not a replacement — for doctors." },
              { icon: Hospital, title: "Hospital Integration", text: "Connected to real hospital networks and slots." },
              { icon: Users, title: "Patient First", text: "Built around trust, privacy, and clarity." },
            ].map((p) => (
              <div key={p.title} className="rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-medical transition-shadow">
                <div className="grid place-items-center h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading align="left" eyebrow="Vision" title="A world where waiting for healthcare is a memory" subtitle="By 2030, we believe every person should be able to consult an intelligent doctor in their own language, in seconds, anywhere on earth." />
          </div>
          <img src={illo} alt="Healthcare illustration" loading="lazy" width={1024} height={1024} className="rounded-[2rem] border border-border shadow-medical max-w-md mx-auto" />
        </div>
      </section>
    </div>
  );
}
