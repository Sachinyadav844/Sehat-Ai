import { motion } from "framer-motion";
import {
  User, Stethoscope, Network, Activity, ShieldAlert, Shield,
  Hospital, CalendarCheck, FileText, LayoutDashboard,
} from "lucide-react";

const nodes = [
  { name: "User", icon: User },
  { name: "AI Doctor", icon: Stethoscope },
  { name: "Orchestrator", icon: Network },
  { name: "Symptom Agent", icon: Activity },
  { name: "Severity Agent", icon: ShieldAlert },
  { name: "Safety Agent", icon: Shield },
  { name: "Hospital Agent", icon: Hospital },
  { name: "Appointment Agent", icon: CalendarCheck },
  { name: "Report Agent", icon: FileText },
  { name: "Dashboard", icon: LayoutDashboard },
];

export function WorkflowDiagram() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
      {nodes.map((n, i) => (
        <motion.div
          key={n.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="relative rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-medical transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-primary text-primary-foreground">
              <n.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Step {i + 1}</div>
              <div className="font-semibold text-sm">{n.name}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
