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
    
    // Generate a sequence of days
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      
      let level = 0;
      let count = 0;
      
      // Simulate some contributions for 2026, and very few for 2025
      if (yearNum === 2026) {
        const rand = Math.random();
        if (rand > 0.75) {
          level = Math.floor(Math.random() * 4) + 1;
          count = level * 2 + Math.floor(Math.random() * 3);
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

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch("/api/github?username=Medhansh-741");
        if (!res.ok) throw new Error("API response error");
        const json: ApiResponse = await res.json();
        setData(json);
        
        // Dynamically select the most recent year returned in total
        if (json && json.total) {
          const years = Object.keys(json.total).sort((a, b) => b.localeCompare(a));
          if (years.length > 0) {
            setSelectedYear(years[0]);
          }
        }
      } catch (err) {
        console.error("Using fallback contribution data:", err);
        const fallback = getFallbackData();
        setData(fallback);
        setSelectedYear("2026");
      } finally {
        setLoading(false);
      }
    }
    fetchContributions();
  }, []);

  if (loading) {
    return <CalendarSkeleton isDark={isDark} />;
  }

  const total = data?.total || { "2026": 238, "2025": 13 };
  const contributions = data?.contributions || [];

  // Filter contributions for the selected year
  const yearContributions = contributions.filter((c) =>
    c.date.startsWith(`${selectedYear}-`)
  );

  // Group contributions into 53 weeks (columns)
  const groupContributionsIntoWeeks = (days: ContributionDay[]) => {
    // Sort ascending by date
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    if (sorted.length === 0) return [];

    const weeks: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    // Find day of week for the first day of the year
    const firstDate = new Date(sorted[0].date);
    const firstDayOfWeek = firstDate.getDay(); // 0 is Sunday, 6 is Saturday

    // Pad the first week with nulls for days before Jan 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Fill in the dates
    sorted.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Pad the last week with nulls if it is not complete
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
    // Find first non-null day in the week
    const firstNonNullDay = week.find((d) => d !== null);
    if (firstNonNullDay) {
      const date = new Date(firstNonNullDay.date);
      const month = date.getMonth();
      if (month !== prevMonth) {
        const label = date.toLocaleString("default", { month: "short" });
        // Avoid adding labels too close to each other
        if (monthLabels.length === 0 || colIdx - monthLabels[monthLabels.length - 1].colIndex > 2) {
          monthLabels.push({ label, colIndex: colIdx });
          prevMonth = month;
        }
      }
    }
  });

  // Color mapping matching active mode accents (shades of Red for light mode, Green for dark mode)
  const getSquareStyle = (level: number) => {
    if (isDark) {
      switch (level) {
        case 0: return "#161b22";
        case 1: return "#022c11";
        case 2: return "#0f5127";
        case 3: return "#1db954";
        case 4: return "#00ff41";
        default: return "#161b22";
      }
    } else {
      switch (level) {
        case 0: return "#ebedf0";
        case 1: return "#fee2e2";
        case 2: return "#fca5a5";
        case 3: return "#f87171";
        case 4: return "#dc2626";
        default: return "#ebedf0";
      }
    }
  };

  const years = Object.keys(total).sort((a, b) => b.localeCompare(a));
  const currentTotal = total[selectedYear] || 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
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

  return (
    <div className="mt-3 select-none w-full max-w-full">
      {/* Total contributions title */}
      <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground mb-2 text-center md:text-left">
        {currentTotal} contributions in {selectedYear}
      </h3>

      {/* Main Container: Flexbox matching Neo-Brutalist Layout */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch w-full">
        
        {/* Calendar Board Card */}
        <div className="flex-1 bg-card border-[3px] border-border shadow-md hover:shadow-[3px_3px_0_0_var(--accent)] p-3 flex flex-col justify-between overflow-hidden transition-all duration-200">
          
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
                        const color = getSquareStyle(day.level);
                        return (
                          <div
                            key={rowIdx}
                            className="w-[10px] h-[10px] rounded-[1.5px] cursor-pointer transition-transform hover:scale-[1.3] hover:z-10 border border-black dark:border-white"
                            style={{ backgroundColor: color }}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
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
            <a 
              href="https://docs.github.com/en/github/setting-up-and-managing-your-github-profile/managing-your-contribution-graph-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline hover:text-foreground text-center sm:text-left"
            >
              Learn how we count contributions
            </a>
            
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
          {hoveredDay.count === 0 ? "No contributions" : `${hoveredDay.count} contribution${hoveredDay.count > 1 ? "s" : ""}`} on {formatDate(hoveredDay.date)}
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
        {/* Calendar Board Card Skeleton */}
        <div className="flex-1 bg-card border-[3px] border-border shadow-md p-3 flex flex-col justify-between overflow-hidden">
          <div className="min-w-[640px] flex flex-col">
            {/* Month Labels row */}
            <div className="flex h-4 pl-[30px] mb-1.5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-8 h-3 bg-muted rounded-[2px]" style={{ marginLeft: i === 0 ? "0px" : "36px" }} />
              ))}
            </div>

            {/* Grid */}
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

        {/* Years Column Skeleton */}
        <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
          <div className="w-16 h-8 bg-muted border border-border rounded-[2px]" />
          <div className="w-16 h-8 bg-muted border border-border rounded-[2px]" />
        </div>
      </div>
    </div>
  );
}
