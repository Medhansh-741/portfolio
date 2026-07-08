"use client";

import { FiCode } from "react-icons/fi";
import RetroCard from "./ui/RetroCard";
import CardHeader from "./ui/CardHeader";
import CardFooter from "./ui/CardFooter";

interface LeetCodeWidgetProps {
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export default function LeetCodeWidget({ className = "", delay = 0.55, style }: LeetCodeWidgetProps) {
  return (
    <RetroCard
      accentColor="#FFA116"
      padding="p-3.5"
      delay={delay}
      className={className}
      style={style}
    >
      {/* Header */}
      <div>
        <CardHeader
          icon={<FiCode size={13} />}
          accentColor="#FFA116"
          title="LEETCODE DSA"
          badge="ACTIVE"
        />

        {/* Stats Content */}
        <div className="mt-3.5 flex flex-col gap-2 font-mono">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">SOLVED:</span>
            <span className="text-sm font-black text-foreground">
              342<span className="text-[10px] text-muted-foreground font-normal">/3200</span>
            </span>
          </div>

          {/* Progress split bars */}
          <div className="flex flex-col gap-1.5 text-[9px] font-bold">
            {/* Easy */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-emerald-500 uppercase">EASY</span>
              <div className="flex-grow h-2 bg-muted border border-border/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 bg-emerald-500" style={{ width: "70%" }} />
              </div>
              <span className="w-6 text-right">156</span>
            </div>
            {/* Medium */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-amber-500 uppercase">MED</span>
              <div className="flex-grow h-2 bg-muted border border-border/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 bg-amber-500" style={{ width: "45%" }} />
              </div>
              <span className="w-6 text-right">162</span>
            </div>
            {/* Hard */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-rose-500 uppercase">HARD</span>
              <div className="flex-grow h-2 bg-muted border border-border/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 bg-rose-500" style={{ width: "12%" }} />
              </div>
              <span className="w-6 text-right">24</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <CardFooter left="RANK: 124,582" right="TOP 4.8%" />
    </RetroCard>
  );
}
