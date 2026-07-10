"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [maxRating, setMaxRating] = useState(0);
  const [rank, setRank] = useState("unrated");
  const [maxRank, setMaxRank] = useState("unrated");
  const [solvedCount, setSolvedCount] = useState(0);
  const [contestCount, setContestCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/codeforces?username=Medhansh_217");
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        
        if (json) {
          setRating(json.rating);
          setMaxRating(json.maxRating);
          setRank(json.rank);
          setMaxRank(json.maxRank);
          setSolvedCount(json.solvedCount);
          setContestCount(json.contestCount);
        }
      } catch (err) {
        console.error("Failed to fetch live Codeforces stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatRank = (r: string) => {
    if (r === "unrated") return "UNRATED";
    return r.toUpperCase();
  };

  const getRankColorClass = (r: string) => {
    const norm = r.toLowerCase();
    if (norm === "unrated") return "text-muted-foreground";
    if (norm === "newbie") return "text-gray-500";
    if (norm === "pupil") return "text-emerald-500";
    if (norm === "specialist") return "text-[#03a89e]";
    if (norm === "expert") return "text-blue-600";
    if (norm === "candidate master") return "text-violet-500";
    return "text-rose-500"; // masters, grandmasters, etc.
  };

  if (loading) {
    return (
      <RetroCard
        accentColor="#3182CE"
        padding="p-3.5"
        delay={delay}
        className={className}
        style={style}
      >
        <div className="animate-pulse flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-border/10">
              <div className="w-20 h-3.5 bg-muted rounded" />
              <div className="w-12 h-4 bg-muted rounded" />
            </div>
            <div className="mt-4 space-y-2.5">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          </div>
          <div className="border-t border-border/10 pt-2 flex justify-between">
            <div className="w-16 h-2.5 bg-muted rounded" />
            <div className="w-12 h-2.5 bg-muted rounded" />
          </div>
        </div>
      </RetroCard>
    );
  }

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
          badge={rating > 0 ? "ACTIVE" : "STANDBY"}
          badgeTextColor="text-white"
        />

        {/* Stats Content */}
        <div className="mt-3.5 flex flex-col gap-2 font-mono">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">RATING:</span>
            <span className={`text-sm font-black uppercase ${getRankColorClass(rank)}`}>
              {rating > 0 ? (
                <>
                  {rating} <span className="text-[9px] font-bold">({formatRank(rank)})</span>
                </>
              ) : (
                "UNRATED"
              )}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-[9px] font-bold text-foreground/80 mt-1">
            <div className="flex justify-between border-b border-border/5 pb-1">
              <span className="text-muted-foreground uppercase">MAX RATING:</span>
              <span className="font-black text-foreground">{maxRating > 0 ? maxRating : "—"}</span>
            </div>
            <div className="flex justify-between border-b border-border/5 pb-1">
              <span className="text-muted-foreground uppercase">PROBLEMS SOLVED:</span>
              <span className="font-black text-foreground">{solvedCount}</span>
            </div>
            <div className="flex justify-between pb-0.5">
              <span className="text-muted-foreground uppercase">CONTESTS PLAYED:</span>
              <span className="font-black text-foreground">{contestCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <CardFooter left="HANDLE: Medhansh_217" right="SYS_SYNCED" />
    </RetroCard>
  );
}
