import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

export function FloatingCard({
  icon: Icon,
  title,
  value,
  delay = 0,
  style,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      }}
      style={style}
      className="absolute rounded-2xl bg-card border border-border shadow-medical p-3 flex items-center gap-3 min-w-[180px] backdrop-blur"
    >
      <div className="grid place-items-center h-9 w-9 rounded-xl bg-mint text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{title}</div>
        <div className="text-sm font-semibold text-foreground">{value}</div>
      </div>
    </motion.div>
  );
}
