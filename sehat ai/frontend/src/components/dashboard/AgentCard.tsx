import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

type Status = "active" | "idle" | "complete";

export function AgentCard({
  name,
  task,
  icon: Icon,
  progress,
  confidence,
  status = "active",
  responseTime,
}: {
  name: string;
  task: string;
  icon: LucideIcon;
  progress: number;
  confidence: number;
  status?: Status;
  responseTime?: string;
}) {
  const statusColor =
    status === "active" ? "bg-primary" : status === "complete" ? "bg-success" : "bg-muted-foreground";
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-border bg-card p-5 shadow-soft hover:shadow-medical transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center h-10 w-10 rounded-xl bg-mint text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-sm">{name}</div>
            <div className="text-xs text-muted-foreground">{task}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={`h-2 w-2 rounded-full ${statusColor} ${status === "active" ? "animate-pulse" : ""}`} />
          {status}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span><span>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-mint overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-gradient-primary"
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Confidence <span className="text-foreground font-semibold">{confidence}%</span></span>
        {responseTime && <span className="text-muted-foreground">{responseTime}</span>}
      </div>
    </motion.div>
  );
}
