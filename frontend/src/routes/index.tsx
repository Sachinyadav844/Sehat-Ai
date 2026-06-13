import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  PhoneCall, AlertTriangle, Activity, Hospital, CalendarCheck,
  FileText, ShieldAlert, Brain, Globe, Mic, Stethoscope,
  Video, Languages, ShieldCheck, Sparkles, ArrowRight, CheckCircle,
  Users, Zap, TrendingUp,
} from "lucide-react";
import heroDoctor from "@/assets/hero-doctor.jpg";
import teleImage from "@/assets/telemedicine.jpg";
import { Button } from "@/components/ui/button";
import { FloatingCard } from "@/components/home/FloatingCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { WorkflowDiagram } from "@/components/home/WorkflowDiagram";
import { useTranslation } from "react-i18next";
import { ensureArray } from '@/lib/utils';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sehat AI — AI-Powered Healthcare Platform" },
      { name: "description", content: "Real-time medical consultations with autonomous AI agents. Comprehensive symptom analysis, hospital matching, appointment booking, and professional medical reports." },
      { property: "og:title", content: "Sehat AI — AI Healthcare Platform" },
      { property: "og:description", content: "Intelligent multi-agent healthcare platform providing real-time medical consultations and comprehensive patient care coordination." },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: Video, title: "Real-Time AI Video Consultation", desc: "Face an AI doctor instantly, anywhere." },
  { icon: Mic, title: "Voice + Text AI Conversation", desc: "Speak or type — the agent understands." },
  { icon: Activity, title: "Symptom Understanding", desc: "Extracts symptoms with medical accuracy." },
  { icon: ShieldAlert, title: "Risk Assessment", desc: "Quantifies severity and urgency live." },
  { icon: AlertTriangle, title: "Safety-Aware Escalation", desc: "Auto-escalates true emergencies." },
  { icon: Hospital, title: "Nearest Hospital Recommendation", desc: "Geo-aware hospital matching." },
  { icon: CalendarCheck, title: "Autonomous Appointment Booking", desc: "Agents book your slot for you." },
  { icon: FileText, title: "AI Medical Report Generation", desc: "Hospital-grade reports, instantly." },
  { icon: Languages, title: "Multilingual Healthcare Support", desc: "English, Hindi, Urdu and more." },
  { icon: Brain, title: "Real-Time Dashboard Monitoring", desc: "Watch every agent reason live." },
];

const stats = [
  { value: "50K+", label: "Lives Supported", icon: Users },
  { value: "10M+", label: "Conversations", icon: Zap },
  { value: "99.9%", label: "Uptime", icon: TrendingUp },
];

const testimonials = [
  {
    name: "Dr. Priya Singh",
    role: "Healthcare Director",
    feedback: "Revolutionary platform that brings specialist-quality care to rural areas.",
    avatar: "👩‍⚕️",
  },
  {
    name: "Rajesh Kumar",
    role: "Patient from Mumbai",
    feedback: "Got answers to my health concerns in 5 minutes. Amazing experience!",
    avatar: "👨‍💼",
  },
  {
    name: "Amina Patel",
    role: "Hospital Administrator",
    feedback: "Reduced patient wait times by 40% while improving diagnostics.",
    avatar: "👩‍💻",
  },
];

const defaultSteps = [
  "Describe Symptoms",
  "AI Triage & Risk",
  "Hospital Match",
  "Get Care Plan",
];

function HomePage() {
  const { t } = useTranslation(["common", "home"]);
  const steps = ensureArray<string>(t("steps", { returnObjects: true }));
  const stepItems = steps.length && typeof steps[0] === 'string' && !steps[0].startsWith('steps') ? steps : defaultSteps;
  
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-mint">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-mint),_transparent_60%)]" />
        
        {/* Animated background shapes */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        
        <div className="container mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-mint border border-border px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> AI-Powered Healthcare Platform
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Talk to an <span className="text-gradient bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">AI Doctor in Real Time</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">Get instant symptom analysis, hospital recommendations, emergency support, and multilingual healthcare assistance powered by intelligent AI systems.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/ai-doctor">
                <Button size="lg" className="rounded-full bg-gradient-primary text-primary-foreground shadow-medical hover:opacity-90 h-12 px-6 group">
                  <PhoneCall className="h-4 w-4 group-hover:scale-110 transition" /> {t('hero.ctaStart')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </Button>
              </Link>
              <Link to="/consult">
                <Button size="lg" variant="outline" className="rounded-full h-12 px-6 border-destructive text-destructive hover:bg-destructive/10">
                  <AlertTriangle className="h-4 w-4" /> {t('hero.ctaEmergency')}
                </Button>
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {ensureArray<string>(t('features', { returnObjects: true })).map((tag, i) => (
                <motion.span 
                  key={tag}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-full bg-card border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/50 transition"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[2rem] overflow-hidden shadow-medical border border-border bg-card"
            >
              <img src={heroDoctor} alt="Smiling AI healthcare doctor" width={1024} height={1024} className="w-full h-auto aspect-square object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
              
              {/* Animated pulse indicator */}
              <motion.div
                className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold">AI Online</span>
              </motion.div>
            </motion.div>

            <FloatingCard icon={Activity} title="Symptom Analysis" value="Fever, Cough" delay={0.2}
              style={{ top: "8%", left: "-8%" }} />
            <FloatingCard icon={ShieldAlert} title="Risk Detected" value="Moderate · 72%" delay={0.5}
              style={{ top: "38%", right: "-10%" }} />
            <FloatingCard icon={Hospital} title="Hospital Matched" value="City Care · 2.1 km" delay={0.8}
              style={{ bottom: "20%", left: "-10%" }} />
            <FloatingCard icon={CalendarCheck} title="Appointment Booked" value="Today · 3:30 PM" delay={1.1}
              style={{ bottom: "-2%", right: "-6%" }} />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-cyan-500/5 to-blue-500/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HUMAN-CENTERED JOURNEY */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="How it works"
            title="Your simple healthcare journey"
            subtitle="A gentle, guided process — talk, get assessed, and receive care. Designed for everyone, especially first-time and rural users."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepItems.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-border p-6 shadow-soft text-center hover:shadow-medical hover:border-primary/50 transition group"
              >
                <motion.div
                  className="text-sm font-semibold text-primary"
                  whileHover={{ scale: 1.2 }}
                >
                  Step {i + 1}
                </motion.div>
                <div className="mt-3 text-lg font-bold group-hover:text-primary transition">{s}</div>
                {i < stepItems.length - 1 && (
                  <ArrowRight className="h-5 w-5 mx-auto mt-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition hidden lg:block absolute right-0 translate-x-6" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="What's inside"
            title="Everything a real clinic does — autonomously"
            subtitle="A complete healthcare stack powered by AI agents working together."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="rounded-3xl bg-card border border-border p-5 shadow-soft hover:shadow-medical transition-all cursor-pointer group"
              >
                <motion.div
                  className="grid place-items-center h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground group-hover:scale-110 transition"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <f.icon className="h-5 w-5" />
                </motion.div>
                <h3 className="mt-4 font-semibold group-hover:text-primary transition">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Stories"
            title="Trusted by healthcare professionals & patients"
            subtitle="Real experiences from people using Sehat AI every day."
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-medical transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{testimonial.feedback}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT BANNER */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-[2rem] overflow-hidden border border-border shadow-medical">
            <img src={teleImage} alt="Telemedicine consultation" loading="lazy" width={1280} height={960} className="w-full h-auto object-cover" />
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why Sehat AI"
              title="Quality healthcare starts with intelligent doctors"
              subtitle="We believe everyone deserves the calm, the clarity, and the speed of a top-tier physician — anytime, in any language."
            />
            <div className="mt-6 space-y-4">
              {[
                { icon: ShieldCheck, label: "Practices medicine that's evidence-based and human." },
                { icon: Stethoscope, label: "Our agents reason like real specialists." },
                { icon: Globe, label: "Built for rural and urban access alike." },
              ].map((it, i) => (
                <motion.div
                  key={it.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="grid place-items-center h-9 w-9 rounded-xl bg-mint text-primary shrink-0 group-hover:scale-110 transition">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-foreground pt-1.5 group-hover:text-primary transition">{it.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-7">
              <Link to="/about">
                <Button className="rounded-full bg-gradient-primary text-primary-foreground shadow-medical group">
                  Learn more
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[2rem] bg-gradient-primary text-primary-foreground p-10 md:p-16 text-center shadow-medical relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_50%)]" />
            
            {/* Animated accent */}
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
              animate={{ y: [0, 30, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <h2 className="font-display text-3xl md:text-5xl font-bold relative z-10">Ready to consult your AI doctor?</h2>
            <p className="mt-3 text-primary-foreground/90 max-w-xl mx-auto relative z-10">
              Get a real-time assessment, recommended hospital, booked appointment and AI report — in minutes.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 relative z-10">
              <Link to="/ai-doctor">
                <Button size="lg" variant="secondary" className="rounded-full h-12 px-6 bg-background text-primary hover:bg-background/90 font-semibold">
                  Start Consultation
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="rounded-full h-12 px-6 border-primary-foreground/40 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                  Create Account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
