"use client";

import { useEffect, useState } from "react";

export default function DeskStation() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <DeskStationSkeleton />;
  }

  // Clock hand angles calculation
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondsDegrees = seconds * 6;
  const minutesDegrees = minutes * 6 + seconds * 0.1;
  const hoursDegrees = (hours % 12) * 30 + minutes * 0.5;

  // Calendar parameters
  const monthName = time.toLocaleDateString("en-US", { month: "short" });
  const dayName = time.toLocaleDateString("en-US", { weekday: "short" });
  const dateNum = time.getDate().toString().padStart(2, "0");
  const yearNum = time.getFullYear();

  return (
    <>
      {/* Analog Clock Widget */}
      <div className="w-40 h-40 border-[3px] border-border bg-background relative shadow-sm rounded-full flex items-center justify-center overflow-hidden">
        {/* Clock Numbers */}
        <span className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-muted-foreground select-none">12</span>
        <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-muted-foreground select-none">6</span>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground select-none">3</span>
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground select-none">9</span>

        {/* Outer Center Ring Pin Cover */}
        <div className="w-3.5 h-3.5 border-2 border-border bg-background rounded-full z-30 absolute" />
        <div className="w-1.5 h-1.5 bg-accent rounded-full z-40 absolute animate-pulse" />

        {/* Clock Hands */}
        {/* Hour Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-[4px] h-[34px] bg-foreground origin-bottom rounded-[2px] z-10"
          style={{
            transform: `translate(-50%, -100%) rotate(${hoursDegrees}deg)`,
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-[3px] h-[46px] bg-foreground origin-bottom rounded-[1.5px] z-15"
          style={{
            transform: `translate(-50%, -100%) rotate(${minutesDegrees}deg)`,
          }}
        />

        {/* Second Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-[1.5px] h-[52px] bg-accent origin-bottom rounded-[1px] z-20"
          style={{
            transform: `translate(-50%, -100%) rotate(${secondsDegrees}deg)`,
          }}
        />
      </div>

      {/* Desk Calendar Widget */}
      <div className="w-40 h-[124px] border-[3px] border-border bg-background shadow-sm rounded-[2px] flex flex-col overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-accent border-b-[3px] border-border py-1 px-2.5 flex justify-between items-center select-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-accent-foreground">
            {monthName}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-accent-foreground/80">
            {yearNum}
          </span>
        </div>

        {/* Sheet Tear-off dotted layout */}
        <div className="w-full h-1 bg-background border-b border-dashed border-border/60" />

        {/* Date Display */}
        <div className="flex-1 flex flex-col items-center justify-center bg-background px-2 pt-1 pb-2 select-none">
          <span className="text-[48px] font-black text-foreground tracking-tighter leading-none font-sans">
            {dateNum}
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/80 mt-1">
            {dayName}
          </span>
        </div>
      </div>

      {/* Book Meet Widget (Static Mockup) */}
      <div className="w-40 h-[124px] border-[3px] border-border bg-background shadow-sm rounded-[2px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-accent-warning border-b-[3px] border-border py-1 px-2.5 flex justify-between items-center select-none text-black">
          <span className="text-[10px] font-black uppercase tracking-wider">
            Let&apos;s Meet
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider bg-black text-accent-warning px-1.5 py-0.5 rounded-[1px]">
            15 MIN
          </span>
        </div>

        {/* Sheet Tear-off layout */}
        <div className="w-full h-1 bg-background border-b border-dashed border-border/60" />

        {/* Body */}
        <div className="flex-1 flex flex-col justify-between bg-background p-2.5 select-none">
          <p className="text-[9px] font-semibold text-muted-foreground leading-tight text-center">
            Want to collaborate? Check my availability for a 1-on-1 virtual chat.
          </p>
          <div className="w-full text-center py-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-background text-foreground border-2 border-border shadow-xs cursor-default">
            Book Meet ↗
          </div>
        </div>
      </div>
    </>
  );
}

function DeskStationSkeleton() {
  return (
    <div className="flex flex-col justify-between h-full w-40 animate-pulse">
      {/* Clock Skeleton */}
      <div className="w-40 h-40 border-[3px] border-neutral-200 dark:border-neutral-800 bg-background/50 rounded-full relative flex items-center justify-center">
        <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
      </div>

      {/* Calendar Skeleton */}
      <div className="w-40 h-[124px] border-[3px] border-neutral-200 dark:border-neutral-800 bg-background/50 rounded-[2px] flex flex-col overflow-hidden">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-800 border-b-[3px] border-neutral-200 dark:border-neutral-800" />
        <div className="flex-1 bg-background/50" />
      </div>

      {/* Book Meet Skeleton */}
      <div className="w-40 h-[124px] border-[3px] border-neutral-200 dark:border-neutral-800 bg-background/50 rounded-[2px] flex flex-col overflow-hidden">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-800 border-b-[3px] border-neutral-200 dark:border-neutral-800" />
        <div className="flex-1 bg-background/50" />
      </div>
    </div>
  );
}
