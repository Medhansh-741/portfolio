import { FiTrendingUp } from "react-icons/fi";
import RetroCard from "./ui/RetroCard";
import CardHeader from "./ui/CardHeader";
import CardFooter from "./ui/CardFooter";
import { getCodeforcesData } from "@/app/lib/api-fetchers";

interface CodeforcesWidgetProps {
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

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
  return "text-rose-500";
};

export default async function CodeforcesWidget({ className = "", delay = 0.65, style }: CodeforcesWidgetProps) {
  const cfData = await getCodeforcesData();

  const rating = cfData.rating;
  const maxRating = cfData.maxRating;
  const rank = cfData.rank;
  const solvedCount = cfData.solvedCount;
  const contestCount = cfData.contestCount;

  return (
    <RetroCard
      accentColor="#3182CE"
      padding="p-3.5 xl:p-[clamp(0.5rem,1.5vh,0.875rem)]"
      delay={delay}
      className={className}
      style={style}
    >
      {/* Header */}
      <CardHeader
        icon={<FiTrendingUp size={13} />}
        accentColor="#3182CE"
        title="CODEFORCES CP"
        badge={rating > 0 ? "ACTIVE" : "STANDBY"}
        badgeTextColor="text-white"
      />

      {/* Stats Content */}
      <div className="flex-1 overflow-y-auto min-h-0 mt-3.5 flex flex-col gap-2 font-mono" data-lenis-prevent>
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

      {/* Footer Details */}
      <CardFooter left="HANDLE: Medhansh_217" right="SYS_SYNCED" />
    </RetroCard>
  );
}

export function CodeforcesSkeleton({ delay = 0.65, className = "", style }: CodeforcesWidgetProps) {
  return (
    <RetroCard
      accentColor="#3182CE"
      padding="p-3.5 xl:p-[clamp(0.5rem,1.5vh,0.875rem)]"
      delay={delay}
      className={className}
      style={style}
    >
      <div className="animate-pulse flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-center pb-2 border-b border-border/10">
            <div className="w-24 h-3.5 bg-muted rounded" />
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
