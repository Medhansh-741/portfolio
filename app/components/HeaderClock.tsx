"use client";

import { useEffect, useState } from "react";

// LCDCell component to render a character precisely over its background shadow cell
function LCDCell({
  char,
  shadowChar = "8",
  className = "",
  style,
  widthClass = "w-[9.5px]",
}: {
  char: string;
  shadowChar?: string;
  className?: string;
  style?: React.CSSProperties;
  widthClass?: string;
}) {
  return (
    <span
      className={`grid place-items-center select-none text-center ${widthClass}`}
      style={style}
    >
      {/* Ghost Background Segment */}
      <span
        className={`row-start-1 col-start-1 opacity-[0.04] text-[#1a251d] dark:text-[#00f3a6] text-center select-none pointer-events-none z-0 ${className}`}
        style={style}
      >
        {shadowChar}
      </span>
      {/* Active Foreground Segment */}
      <span
        className={`row-start-1 col-start-1 text-center ${className}`}
        style={style}
      >
        {char}
      </span>
    </span>
  );
}

export default function HeaderClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <HeaderClockSkeleton />;
  }

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const day = time.getDate().toString().padStart(2, "0");
  const month = (time.getMonth() + 1).toString().padStart(2, "0");
  const shortYear = time.getFullYear().toString().slice(-2); // e.g. "26"

  return (
    <div className="filter drop-shadow-[2px_2px_0px_#000000] dark:drop-shadow-[2px_2px_0px_rgba(0,243,166,0.25)] translate-y-[1.5px] hidden sm:inline-flex select-none">
      {/* Octagonal Bezel Border Container */}
      <div className="bg-border dark:bg-[#00f3a6]/35 p-[1.5px] [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] flex items-center justify-center">
        {/* LCD Screen Display */}
        <div className="bg-[#cad3c8] dark:bg-[#08120f] text-[#1a251d] dark:text-[#00f3a6] px-2.5 py-0.5 flex flex-col items-center justify-center [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] w-[88px] h-[38px] transition-all duration-300">
          
          {/* Top Row: Large Time (7-segment) */}
          <div className="flex items-center justify-center w-full font-digital text-sm font-bold border-b border-[#1a251d]/10 dark:border-[#00f3a6]/10 pb-[1.5px] mb-[1.5px]">
            {hours.split("").map((c, i) => (
              <LCDCell key={`h-${i}`} char={c} />
            ))}
            <LCDCell
              char=":"
              shadowChar=":"
              className="animate-pulse text-[#1a251d]/60 dark:text-[#00f3a6]/60 mx-[0.5px]"
              widthClass="w-[6px]"
            />
            {minutes.split("").map((c, i) => (
              <LCDCell key={`m-${i}`} char={c} />
            ))}
            <LCDCell
              char=":"
              shadowChar=":"
              className="animate-pulse text-[#1a251d]/60 dark:text-[#00f3a6]/60 mx-[0.5px]"
              widthClass="w-[6px]"
            />
            {seconds.split("").map((c, i) => (
              <LCDCell key={`s-${i}`} char={c} />
            ))}
          </div>

          {/* Bottom Row: Date digits (7-segment) */}
          <div className="flex items-center justify-center w-full font-digital text-[9px] font-bold">
            {day.split("").map((c, i) => (
              <LCDCell key={`d-${i}`} char={c} widthClass="w-[6.5px]" />
            ))}
            <LCDCell char="-" shadowChar="-" widthClass="w-[6.5px]" />
            {month.split("").map((c, i) => (
              <LCDCell key={`mo-${i}`} char={c} widthClass="w-[6.5px]" />
            ))}
            <LCDCell char="-" shadowChar="-" widthClass="w-[6.5px]" />
            {shortYear.split("").map((c, i) => (
              <LCDCell key={`y-${i}`} char={c} widthClass="w-[6.5px]" />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

function HeaderClockSkeleton() {
  return (
    <div className="filter drop-shadow-[2px_2px_0px_#000000] dark:drop-shadow-[2px_2px_0px_rgba(0,243,166,0.25)] translate-y-[1.5px] hidden sm:inline-flex select-none">
      <div className="bg-border dark:bg-[#00f3a6]/35 p-[1.5px] [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] flex items-center justify-center">
        <div className="bg-[#cad3c8] dark:bg-[#08120f] [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] w-[88px] h-[38px] animate-pulse" />
      </div>
    </div>
  );
}
