"use client";

import { useEffect, useState } from "react";
import LcdClockFace from "./LcdClockFace";

export default function MobileClock() {
	const [time, setTime] = useState<Date | null>(null);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTime(new Date());
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	if (!time) {
		return <MobileClockSkeleton />;
	}

	const hours = time.getHours().toString().padStart(2, "0");
	const minutes = time.getMinutes().toString().padStart(2, "0");

	return (
		<div className="filter drop-shadow-[2px_2px_0px_#000000] dark:drop-shadow-[2px_2px_0px_rgba(0,243,166,0.25)] translate-y-[1.5px] select-none shrink-0">
			<div className="bg-border dark:bg-[#00f3a6]/35 p-[1.5px] [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] flex items-center justify-center">
				<div className="bg-[#cad3c8] dark:bg-[#08120f] text-[#1a251d] dark:text-[#00f3a6] px-2 py-1 flex flex-col items-center justify-center [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] w-[64px] h-[28px] transition-all duration-300">
					<LcdClockFace
						hours={hours}
						minutes={minutes}
						className="flex items-center justify-center w-full font-digital text-sm font-bold"
					/>
				</div>
			</div>
		</div>
	);
}

function MobileClockSkeleton() {
	return (
		<div className="filter drop-shadow-[2px_2px_0px_#000000] dark:drop-shadow-[2px_2px_0px_rgba(0,243,166,0.25)] translate-y-[1.5px] select-none shrink-0">
			<div className="bg-border dark:bg-[#00f3a6]/35 p-[1.5px] [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] flex items-center justify-center">
				<div className="bg-[#cad3c8] dark:bg-[#08120f] [clip-path:polygon(6px_0%,calc(100%-6px)_0%,100%_6px,100%_calc(100%-6px),calc(100%-6px)_100%,6px_100%,0%_calc(100%-6px),0%_6px)] w-[64px] h-[28px] animate-pulse" />
			</div>
		</div>
	);
}
