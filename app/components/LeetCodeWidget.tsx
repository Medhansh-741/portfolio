"use client";

import { useEffect, useState } from "react";
import { FiCode } from "react-icons/fi";
import RetroCard from "./ui/RetroCard";
import CardHeader from "./ui/CardHeader";
import CardFooter from "./ui/CardFooter";

interface LeetCodeWidgetProps {
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

interface StatsDifficulty {
  solved: number;
  total: number;
}

export default function LeetCodeWidget({ className = "", delay = 0.55, style }: LeetCodeWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [solved, setSolved] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(3200);
  const [easy, setEasy] = useState<StatsDifficulty>({ solved: 0, total: 950 });
  const [medium, setMedium] = useState<StatsDifficulty>({ solved: 0, total: 2000 });
  const [hard, setHard] = useState<StatsDifficulty>({ solved: 0, total: 950 });
  const [rating, setRating] = useState<number | null>(null);
  const [topPercentage, setTopPercentage] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/leetcode?username=iXfyEpMpyu");
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        
        if (json && json.data) {
          const { allQuestionsCount, matchedUser, userContestRanking } = json.data;

          // Parse total questions counts
          if (allQuestionsCount) {
            const all = allQuestionsCount.find((q: any) => q.difficulty === "All");
            const e = allQuestionsCount.find((q: any) => q.difficulty === "Easy");
            const m = allQuestionsCount.find((q: any) => q.difficulty === "Medium");
            const h = allQuestionsCount.find((q: any) => q.difficulty === "Hard");

            if (all) setTotalQuestions(all.count);
            if (e) setEasy(prev => ({ ...prev, total: e.count }));
            if (m) setMedium(prev => ({ ...prev, total: m.count }));
            if (h) setHard(prev => ({ ...prev, total: h.count }));
          }

          // Parse solved counts
          if (matchedUser && matchedUser.submitStats && matchedUser.submitStats.acSubmissionNum) {
            const acStats = matchedUser.submitStats.acSubmissionNum;
            const allSolved = acStats.find((q: any) => q.difficulty === "All");
            const eSolved = acStats.find((q: any) => q.difficulty === "Easy");
            const mSolved = acStats.find((q: any) => q.difficulty === "Medium");
            const hSolved = acStats.find((q: any) => q.difficulty === "Hard");

            if (allSolved) setSolved(allSolved.count);
            if (eSolved) setEasy(prev => ({ ...prev, solved: eSolved.count }));
            if (mSolved) setMedium(prev => ({ ...prev, solved: mSolved.count }));
            if (hSolved) setHard(prev => ({ ...prev, solved: hSolved.count }));
          }

          // Contest ranking
          if (userContestRanking) {
            setRating(Math.round(userContestRanking.rating));
            setTopPercentage(userContestRanking.topPercentage);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live LeetCode stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const getWidthPercent = (diff: StatsDifficulty) => {
    if (diff.solved === 0) return "0%";
    const pct = (diff.solved / diff.total) * 100;
    // Guarantee visible line for minimal solved items
    return `${Math.max(pct, 2)}%`;
  };

  if (loading) {
    return (
      <RetroCard
        accentColor="#FFA116"
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
            <div className="mt-4 space-y-3">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-2 bg-muted rounded w-full" />
              <div className="h-2 bg-muted rounded w-full" />
              <div className="h-2 bg-muted rounded w-full" />
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
          badge={rating ? "ACTIVE" : "STANDBY"}
        />

        {/* Stats Content */}
        <div className="mt-3.5 flex flex-col gap-2 font-mono">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">SOLVED:</span>
            <span className="text-sm font-black text-foreground">
              {solved}<span className="text-[10px] text-muted-foreground font-normal">/{totalQuestions}</span>
            </span>
          </div>

          {/* Progress split bars */}
          <div className="flex flex-col gap-1.5 text-[9px] font-bold">
            {/* Easy */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-emerald-500 uppercase">EASY</span>
              <div className="flex-grow h-2 bg-muted border border-border/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 bg-emerald-500" style={{ width: getWidthPercent(easy) }} />
              </div>
              <span className="w-6 text-right">{easy.solved}</span>
            </div>
            {/* Medium */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-amber-500 uppercase">MED</span>
              <div className="flex-grow h-2 bg-muted border border-border/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 bg-amber-500" style={{ width: getWidthPercent(medium) }} />
              </div>
              <span className="w-6 text-right">{medium.solved}</span>
            </div>
            {/* Hard */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-rose-500 uppercase">HARD</span>
              <div className="flex-grow h-2 bg-muted border border-border/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 bg-rose-500" style={{ width: getWidthPercent(hard) }} />
              </div>
              <span className="w-6 text-right">{hard.solved}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <CardFooter 
        left={rating ? `RATING: ${rating}` : "RANK: UNRATED"} 
        right={topPercentage ? `TOP ${topPercentage}%` : "LIVE_SYNCED"} 
      />
    </RetroCard>
  );
}
