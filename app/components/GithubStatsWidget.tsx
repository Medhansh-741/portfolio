"use client";

import { FiGithub } from "react-icons/fi";
import RetroCard from "./ui/RetroCard";
import CardHeader from "./ui/CardHeader";
import CardFooter from "./ui/CardFooter";

interface GithubStatsWidgetProps {
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export default function GithubStatsWidget({ className = "", delay = 0.75, style }: GithubStatsWidgetProps) {
  return (
    <RetroCard
      accentColor="var(--color-accent-secondary)"
      padding="p-3.5"
      delay={delay}
      className={className}
      style={style}
    >
      {/* Header */}
      <div>
        <CardHeader
          icon={<FiGithub size={13} />}
          accentColor="var(--color-accent-secondary)"
          title="GIT ARCHIVE"
          badge="SYNCED"
        />

        {/* Stats Content */}
        <div className="mt-3.5 flex flex-col gap-2 font-mono">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">PUBLIC REPOS:</span>
            <span className="text-sm font-black text-foreground">
              12<span className="text-[10px] text-muted-foreground font-normal"> / 24★</span>
            </span>
          </div>

          {/* Language Breakdown */}
          <div className="flex flex-col gap-1.5 text-[9px] font-bold mt-1">
            <span className="text-[8px] text-muted-foreground uppercase">LANGUAGES:</span>
            
            {/* Split stack bar */}
            <div className="w-full h-3 border border-border/20 flex overflow-hidden rounded-[1px] bg-muted">
              <div className="h-full bg-[var(--color-accent-secondary)]" style={{ width: "65%" }} title="Python: 65%" />
              <div className="h-full bg-[var(--color-accent-warning)]" style={{ width: "25%" }} title="TypeScript: 25%" />
              <div className="h-full bg-[var(--color-accent)]" style={{ width: "10%" }} title="C++: 10%" />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-[8px] font-black text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[var(--color-accent-secondary)]" /> PY 65%</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[var(--color-accent-warning)]" /> TS 25%</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[var(--color-accent)]" /> C++ 10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <CardFooter left="COMMITS: 1,248" right="ACTIVE_2026" />
    </RetroCard>
  );
}
