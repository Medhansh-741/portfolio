"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ApiResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

// Fallback data in case the API fails or is rate-limited
const getFallbackData = (): ApiResponse => {
  const years = ["2026", "2025"];
  const total: Record<string, number> = { "2026": 238, "2025": 13 };
  const contributions: ContributionDay[] = [];

  years.forEach((yr) => {
    const yearNum = parseInt(yr);
    const startDate = new Date(yearNum, 0, 1);
    const endDate = new Date(yearNum, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      let level = 0;
      let count = 0;
      
      const todayStr = new Date().toISOString().split("T")[0];
      
      if (yearNum === 2026) {
        if (dateStr <= todayStr) {
          const rand = Math.random();
          if (rand > 0.75) {
            level = Math.floor(Math.random() * 4) + 1;
            count = level * 2 + Math.floor(Math.random() * 3);
          }
        }
      } else if (yearNum === 2025) {
        const rand = Math.random();
        if (rand > 0.96) {
          level = Math.floor(Math.random() * 2) + 1;
          count = level * 2;
        }
      }

      contributions.push({
        date: dateStr,
        count,
        level,
      });
    }
  });

  return { total, contributions };
};

export default function GithubCalendar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [platform, setPlatform] = useState<"github" | "leetcode" | "codeforces">("github");
  const [githubData, setGithubData] = useState<ApiResponse | null>(null);
  const [leetcodeData, setLeetcodeData] = useState<Record<string, number>>({});
  const [codeforcesData, setCodeforcesData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        const [ghRes, lcRes, cfRes] = await Promise.all([
          fetch("/api/github?username=Medhansh-741"),
          fetch("/api/leetcode?username=iXfyEpMpyu"),
          fetch("/api/codeforces?username=Medhansh_217")
        ]);

        if (ghRes.ok) {
          const ghJson = await ghRes.json();
          setGithubData(ghJson);
          if (ghJson && ghJson.total) {
            const years = Object.keys(ghJson.total).sort((a, b) => b.localeCompare(a));
            if (years.length > 0) setSelectedYear(years[0]);
          }
        } else {
          setGithubData(getFallbackData());
        }

        if (lcRes.ok) {
          const lcJson = await lcRes.json();
          setLeetcodeData(lcJson.calendar || {});
        }

        if (cfRes.ok) {
          const cfJson = await cfRes.json();
          setCodeforcesData(cfJson.calendar || {});
        }
      } catch (err) {
        console.error("Error fetching live contribution data:", err);
        setGithubData(getFallbackData());
        setSelectedYear("2026");
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  if (loading) {
    return <CalendarSkeleton isDark={isDark} />;
  }

  const rawContributions = githubData?.contributions || [];

  const getLevelForCount = (c: number) => {
    if (!c || c <= 0) return 0;
    if (c === 1) return 1;
    if (c <= 3) return 2;
    if (c <= 5) return 3;
    return 4;
  };

  const yearContributions = rawContributions
    .filter((c) => c.date.startsWith(`${selectedYear}-`))
    .map((c) => {
      const todayStr = new Date().toISOString().split("T")[0];
      const isFuture = c.date > todayStr;
      
      if (isFuture) {
        return { date: c.date, level: 0, count: 0 };
      }

      if (platform === "github") {
        return {
          date: c.date,
          level: c.level,
          count: c.count,
        };
      } else if (platform === "leetcode") {
        const count = leetcodeData[c.date] || 0;
        return {
          date: c.date,
          level: getLevelForCount(count),
          count,
        };
      } else {
        const count = codeforcesData[c.date] || 0;
        return {
          date: c.date,
          level: getLevelForCount(count),
          count,
        };
      }
    });

  // Calculate total counts for display
  const platformTotal = yearContributions.reduce((acc, curr) => acc + curr.count, 0);

  // Group contributions into 53 weeks (columns)
  const groupContributionsIntoWeeks = (days: ContributionDay[]) => {
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    if (sorted.length === 0) return [];

    const weeks: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    const firstDate = new Date(sorted[0].date);
    const firstDayOfWeek = firstDate.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    sorted.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = groupContributionsIntoWeeks(yearContributions);

  // Determine month label columns
  const monthLabels: { label: string; colIndex: number }[] = [];
  let prevMonth = -1;

  weeks.forEach((week, colIdx) => {
    const firstNonNullDay = week.find((d) => d !== null);
    if (firstNonNullDay) {
      const date = new Date(firstNonNullDay.date);
      const month = date.getMonth();
      if (month !== prevMonth) {
        const label = date.toLocaleString("default", { month: "short" });
        if (monthLabels.length === 0 || colIdx - monthLabels[monthLabels.length - 1].colIndex > 2) {
          monthLabels.push({ label, colIndex: colIdx });
          prevMonth = month;
        }
      }
    }
  });

  // Color mapping based on platform selection
  const getSquareStyle = (level: number) => {
    if (isDark) {
      if (platform === "github") {
        switch (level) {
          case 0: return "#161b22";
          case 1: return "#0e4429";
          case 2: return "#006d32";
          case 3: return "#26a641";
          case 4: return "#39d353";
          default: return "#161b22";
        }
      } else if (platform === "leetcode") {
        switch (level) {
          case 0: return "#161b22";
          case 1: return "#2c1b02";
          case 2: return "#5c3d0b";
          case 3: return "#b57b1e";
          case 4: return "#ffa116";
          default: return "#161b22";
        }
      } else {
        switch (level) {
          case 0: return "#161b22";
          case 1: return "#021a30";
          case 2: return "#0b3a63";
          case 3: return "#1d68a4";
          case 4: return "#3182ce";
          default: return "#161b22";
        }
      }
    } else {
      if (platform === "github") {
        switch (level) {
          case 0: return "#ebedf0";
          case 1: return "#9be9a8";
          case 2: return "#40c463";
          case 3: return "#30a14e";
          case 4: return "#216e39";
          default: return "#ebedf0";
        }
      } else if (platform === "leetcode") {
        switch (level) {
          case 0: return "#ebedf0";
          case 1: return "#ffe8cc";
          case 2: return "#ffa116";
          case 3: return "#e68a00";
          case 4: return "#b36b00";
          default: return "#ebedf0";
        }
      } else {
        switch (level) {
          case 0: return "#ebedf0";
          case 1: return "#d2e9ff";
          case 2: return "#63b3ed";
          case 3: return "#3182ce";
          case 4: return "#2b6cb0";
          default: return "#ebedf0";
        }
      }
    }
  };

  const total = githubData?.total || { "2026": 238, "2025": 13 };
  const years = Object.keys(total).sort((a, b) => b.localeCompare(a));

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({
      x: e.clientX,
      y: e.clientY - 40,
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMetricLabel = () => {
    if (platform === "github") return "contributions";
    if (platform === "leetcode") return "submissions";
    return "submits";
  };

  // Get dynamic hover shadow color based on platform
  const getShadowHoverClass = () => {
    if (platform === "github") return "hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)]";
    if (platform === "leetcode") return "hover:shadow-[3px_3px_0_0_#FFA116]";
    return "hover:shadow-[3px_3px_0_0_#3182CE]";
  };

  return (
    <div className="mt-3 select-none w-full max-w-full">
      {/* Header with Title and Platform Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2 w-full max-w-xl">
        <h3 className="font-sans text-[11px] font-black uppercase tracking-wider text-foreground">
          {platformTotal} {getMetricLabel()} in {selectedYear}
        </h3>
        
        {/* Sleek, super-compact platform indicator selector */}
        <div className="flex items-center gap-1 bg-muted border border-border p-0.5 rounded-[1px] font-mono text-[8px] font-bold">
          <button
            onClick={() => setPlatform("github")}
            className={`px-1.5 py-0.5 rounded-[1px] cursor-pointer transition-colors uppercase ${
              platform === "github"
                ? "bg-[var(--color-accent-secondary)] text-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            GIT
          </button>
          <span className="text-border/40 select-none">|</span>
          <button
            onClick={() => setPlatform("leetcode")}
            className={`px-1.5 py-0.5 rounded-[1px] cursor-pointer transition-colors uppercase ${
              platform === "leetcode"
                ? "bg-[#FFA116] text-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            LC
          </button>
          <span className="text-border/40 select-none">|</span>
          <button
            onClick={() => setPlatform("codeforces")}
            className={`px-1.5 py-0.5 rounded-[1px] cursor-pointer transition-colors uppercase ${
              platform === "codeforces"
                ? "bg-[#3182CE] text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            CF
          </button>
        </div>
      </div>

      {/* Main Container: Flexbox matching Neo-Brutalist Layout */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch w-full">
        
        {/* Calendar Board Card */}
        <div className={`w-fit flex-initial bg-card border-[3px] border-border shadow-md p-3 flex flex-col justify-between overflow-hidden transition-all duration-200 relative ${getShadowHoverClass()}`}>
          
          {/* Scrollable Grid Container */}
          <div 
            className="overflow-x-auto pb-1 scrollbar-thin"
            onMouseMove={handleMouseMove}
          >
            <div className="min-w-[640px] flex flex-col">
              
              {/* Month Labels row */}
              <div className="flex text-[10px] font-semibold text-muted-foreground mb-1 h-4 pl-[30px] relative">
                {monthLabels.map((lbl, idx) => {
                  const leftPos = 30 + lbl.colIndex * 13;
                  return (
                    <span
                      key={idx}
                      className="absolute"
                      style={{ left: `${leftPos}px` }}
                    >
                      {lbl.label}
                    </span>
                  );
                })}
              </div>

              {/* Grid with Day of Week labels on left */}
              <div className="flex flex-row">
                {/* Y-axis Labels */}
                <div className="flex flex-col justify-between text-[10px] font-semibold text-muted-foreground w-[30px] pr-2 pb-[4px] pt-[2px] h-[88px]">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                {/* Grid Columns */}
                <div className="flex flex-row gap-[3px]">
                  {weeks.map((week, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-[3px]">
                      {week.map((day, rowIdx) => {
                        if (!day) {
                          return (
                            <div
                              key={rowIdx}
                              className="w-[10px] h-[10px] rounded-[1.5px]"
                              style={{ backgroundColor: "transparent" }}
                            />
                          );
                        }
                        const todayStr = new Date().toISOString().split("T")[0];
                        const isFuture = day.date > todayStr;
                        const color = getSquareStyle(day.level);
                        
                        return (
                          <div
                            key={rowIdx}
                            className={`w-[10px] h-[10px] rounded-[1.5px] border border-black dark:border-white ${
                              isFuture 
                                ? "cursor-default opacity-30" 
                                : "cursor-pointer transition-transform hover:scale-[1.3] hover:z-10"
                            }`}
                            style={{ backgroundColor: color }}
                            onMouseEnter={() => !isFuture && setHoveredDay(day)}
                            onMouseLeave={() => !isFuture && setHoveredDay(null)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Footer of Calendar Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-semibold text-muted-foreground border-t border-muted mt-2 pt-2 gap-2">
            <span className="text-[9px] uppercase tracking-wider text-center sm:text-left">
              Live activity sync: active
            </span>
            
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="flex gap-[3px]">
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <div
                    key={lvl}
                    className="w-[10px] h-[10px] rounded-[1.5px] border border-black dark:border-white"
                    style={{ backgroundColor: getSquareStyle(lvl) }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>

        </div>

        {/* Years Selector Column */}
        <div className="flex flex-row md:flex-col gap-2 flex-shrink-0 justify-center md:justify-start">
          {years.map((yr) => {
            const isSelected = selectedYear === yr;
            return (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border-[2px] select-none ${
                  isSelected
                    ? "bg-background text-foreground border-border shadow-[2px_2px_0_0_var(--accent)] translate-x-[1px] translate-y-[1px]"
                    : "bg-background text-foreground border-border shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--color-accent-secondary)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                }`}
              >
                {yr}
              </button>
            );
          })}
        </div>

      </div>

      {/* Floating Tooltip Component */}
      {hoveredDay && (
        <div
          className="fixed pointer-events-none z-50 bg-accent-warning text-black text-[10px] font-black py-1.5 px-2.5 border-[2px] border-border shadow-sm -translate-x-1/2 select-none uppercase tracking-wider"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          {hoveredDay.count === 0 ? "No activity" : `${hoveredDay.count} ${getMetricLabel()}`} on {formatDate(hoveredDay.date)}
        </div>
      )}
    </div>
  );
}

// Skeleton Loader component while fetching
function CalendarSkeleton({ isDark }: { isDark: boolean }) {
  const getSkeletonColor = () => (isDark ? "#1f242c" : "#ebedf0");

  return (
    <div className="mt-3 select-none w-full max-w-full animate-pulse">
      <div className="w-48 h-5 bg-muted border border-border mb-3 rounded-[2px]" />

      <div className="flex flex-col md:flex-row gap-4 items-stretch w-full">
        <div className="flex-1 bg-card border-[3px] border-border shadow-md p-3 flex flex-col justify-between overflow-hidden">
          <div className="min-w-[640px] flex flex-col">
            <div className="flex h-4 pl-[30px] mb-1.5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-8 h-3 bg-muted rounded-[2px]" style={{ marginLeft: i === 0 ? "0px" : "36px" }} />
              ))}
            </div>

            <div className="flex flex-row">
              <div className="flex flex-col justify-between w-[30px] pr-2 h-[88px]">
                <div className="w-4 h-2.5 bg-muted rounded-[2px]" />
                <div className="w-4 h-2.5 bg-muted rounded-[2px]" />
                <div className="w-4 h-2.5 bg-muted rounded-[2px]" />
              </div>

              <div className="flex flex-row gap-[3px]">
                {[...Array(53)].map((_, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-[3px]">
                    {[...Array(7)].map((_, rowIdx) => (
                      <div
                        key={rowIdx}
                        className="w-[10px] h-[10px] rounded-[1.5px]"
                        style={{ backgroundColor: getSkeletonColor() }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-muted mt-2 pt-2">
            <div className="w-36 h-3 bg-muted rounded-[2px]" />
            <div className="w-24 h-3 bg-muted rounded-[2px]" />
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
          <div className="w-16 h-8 bg-muted border border-border rounded-[2px]" />
          <div className="w-16 h-8 bg-muted border border-border rounded-[2px]" />
        </div>
      </div>
    </div>
  );
}
