"use client";

import { FiTrendingUp } from "react-icons/fi";
import RetroCard from "./ui/RetroCard";
import CardHeader from "./ui/CardHeader";
import CardFooter from "./ui/CardFooter";

interface CodeforcesWidgetProps {
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export default function CodeforcesWidget({ className = "", delay = 0.65, style }: CodeforcesWidgetProps) {
  return (
    <RetroCard
      accentColor="#3182CE"
      padding="p-3.5"
      delay={delay}
      className={className}
      style={style}
    >
      {/* Header */}
      <div>
        <CardHeader
          icon={<FiTrendingUp size={13} />}
          accentColor="#3182CE"
          title="CODEFORCES CP"
          badge="ACTIVE"
          badgeTextColor="text-white"
        />

        {/* Stats Content */}
        <div className="mt-3.5 flex flex-col gap-2 font-mono">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">RATING:</span>
            <span className="text-sm font-black text-[#3182CE] uppercase">
              1425 <span className="text-[9px] font-bold text-[#3182CE]">(SPECIALIST)</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-[9px] font-bold text-foreground/80 mt-1">
            <div className="flex justify-between border-b border-border/5 pb-1">
              <span className="text-muted-foreground uppercase">MAX RATING:</span>
              <span className="font-black text-foreground">1508</span>
            </div>
            <div className="flex justify-between border-b border-border/5 pb-1">
              <span className="text-muted-foreground uppercase">PROBLEMS SOLVED:</span>
              <span className="font-black text-foreground">184</span>
            </div>
            <div className="flex justify-between pb-0.5">
              <span className="text-muted-foreground uppercase">CONTESTS PLAYED:</span>
              <span className="font-black text-foreground">22</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <CardFooter left="HANDLE: Medhansh-741" right="SYS_SYNCED" />
    </RetroCard>
  );
}
