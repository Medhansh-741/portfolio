"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { FiGitCommit, FiGithub } from "react-icons/fi";
import RetroCard from "./ui/RetroCard";
import CardHeader from "./ui/CardHeader";
import CardFooter from "./ui/CardFooter";

interface Commit {
  id: string;
  repo: string;
  message: string;
  date: string; // ISO string
  link: string; // Absolute GitHub commit URL
}

// Fallback mock commits in case the GitHub API fetch fails or hits rate limits
const mockFallbackCommits: Commit[] = [
  {
    id: "fb1",
    repo: "Medhansh-741/portfolio",
    message: "style: custom calendar borders and mode colors",
    date: new Date(Date.now() - 3600 * 2000).toISOString(),
    link: "https://github.com/Medhansh-741/portfolio",
  },
  {
    id: "fb2",
    repo: "Medhansh-741/portfolio",
    message: "feat: add api route proxy for github contributions",
    date: new Date(Date.now() - 3600 * 5000).toISOString(),
    link: "https://github.com/Medhansh-741/portfolio",
  },
  {
    id: "fb3",
    repo: "Medhansh-741/ai-agent",
    message: "refactor: optimize model system prompts",
    date: new Date(Date.now() - 3600 * 24000).toISOString(),
    link: "https://github.com/Medhansh-741/ai-agent",
  },
  {
    id: "fb4",
    repo: "Medhansh-741/ai-agent",
    message: "init: initial project setup and pipeline tests",
    date: new Date(Date.now() - 3600 * 72000).toISOString(),
    link: "https://github.com/Medhansh-741/ai-agent",
  },
];

interface CommitFeedProps {
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export default function CommitFeed({ className = "", delay = 0.7, style }: CommitFeedProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchCommits() {
      try {
        const res = await fetch("/api/github-activity?username=Medhansh-741");
        if (!res.ok) throw new Error("API failed");
        const json = await res.json();
        
        if (Array.isArray(json) && json.length > 0) {
          setCommits(json);
        } else {
          setCommits(mockFallbackCommits);
        }
      } catch (err) {
        console.error("Using fallback commits:", err);
        setCommits(mockFallbackCommits);
      } finally {
        setLoading(false);
      }
    }
    fetchCommits();
  }, []);

  const timeAgo = (dateStr: string) => {
    if (!mounted) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    
    for (const [unit, val] of Object.entries(intervals)) {
      const count = Math.floor(seconds / val);
      if (count >= 1) {
        return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  const cleanRepoName = (name: string) => {
    return name.replace(/^Medhansh-741\//, "");
  };

  if (loading) {
    return <CommitFeedSkeleton isDark={isDark} />;
  }

  // Ensure we have at least 4 commits for scrolling layout to scroll cleanly
  const displayCommits = [...commits];
  if (displayCommits.length > 0 && displayCommits.length < 4) {
    mockFallbackCommits.forEach((m) => {
      if (displayCommits.length < 4) displayCommits.push(m);
    });
  }

  return (
    <RetroCard
      accentColor="var(--color-accent)"
      padding="p-4"
      delay={delay}
      className={className}
      style={style}
    >
      {/* Header — clickable GitHub icon badge replaces @Medhansh-741 subtitle */}
      <CardHeader
        icon={<FiGitCommit size={14} />}
        accentColor="var(--color-accent)"
        title="LIVE ACTIVITY"
        badge={<FiGithub size={11} />}
        badgeHref="https://github.com/Medhansh-741"
        pulse
      />

      {/* Timeline Viewport Container */}
      <div className="relative pr-1 w-full h-[calc(100%-80px)] overflow-hidden mt-3">
        {/* Dotted Vertical Timeline Line */}
        <div className="absolute left-[9px] top-1 bottom-1 w-0.5 border-l-[2px] border-dashed border-muted z-0" />

        {/* Marquee Wrapper: Contains two copies of the list for seamless wrapping */}
        <div className="marquee-vertical gap-4 py-1">
          {/* First Copy */}
          <div className="flex flex-col gap-4">
            {displayCommits.map((commit, idx) => (
              <a
                key={`c1-${commit.id}-${idx}`}
                href={commit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start relative group cursor-pointer text-left"
              >
                <div className="w-5 h-5 rounded-full border-[2px] border-border bg-card flex items-center justify-center z-10 flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                </div>
                <div className="flex-1 ml-3 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground truncate leading-none mb-1">
                    {cleanRepoName(commit.repo)}
                  </p>
                  <h4 className="text-[11px] font-bold leading-tight text-foreground truncate group-hover:text-accent-secondary group-hover:underline">
                    {commit.message}
                  </h4>
                  <span className="text-[9px] font-semibold text-muted-foreground block mt-0.5 leading-none">
                    {timeAgo(commit.date)}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Spacer between copies */}
          <div className="h-4 flex-shrink-0" />

          {/* Second Copy (for looping) */}
          <div className="flex flex-col gap-4">
            {displayCommits.map((commit, idx) => (
              <a
                key={`c2-${commit.id}-${idx}`}
                href={commit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start relative group cursor-pointer text-left"
              >
                <div className="w-5 h-5 rounded-full border-[2px] border-border bg-card flex items-center justify-center z-10 flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                </div>
                <div className="flex-1 ml-3 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground truncate leading-none mb-1">
                    {cleanRepoName(commit.repo)}
                  </p>
                  <h4 className="text-[11px] font-bold leading-tight text-foreground truncate group-hover:text-accent-secondary group-hover:underline">
                    {commit.message}
                  </h4>
                  <span className="text-[9px] font-semibold text-muted-foreground block mt-0.5 leading-none">
                    {timeAgo(commit.date)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer — standard text footer replacing the big VIEW ON GITHUB button */}
      <CardFooter left="@Medhansh-741" right="LIVE_FEED" />
    </RetroCard>
  );
}

function CommitFeedSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div className="w-full md:w-60 h-full bg-card border-[3px] border-border shadow-md p-4 flex flex-col justify-between overflow-hidden animate-pulse">
      <div>
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <div className="w-24 h-3 bg-muted rounded" />
          <div className="w-8 h-4 bg-muted rounded" />
        </div>
      </div>

      <div className="relative flex-1 mt-3">
        <div className="absolute left-[9px] top-1.5 bottom-1.5 w-0.5 border-l-[2px] border-dashed border-muted" />
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-muted border-[2px] border-border flex-shrink-0" />
              <div className="flex-1 ml-3 space-y-1.5">
                <div className="w-16 h-2 bg-muted rounded" />
                <div className="w-full h-3.5 bg-muted rounded" />
                <div className="w-12 h-2.5 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/10 pt-2 flex justify-between items-center">
        <div className="w-20 h-2.5 bg-muted rounded" />
        <div className="w-16 h-2.5 bg-muted rounded" />
      </div>
    </div>
  );
}
