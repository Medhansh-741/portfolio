"use client";

import { useEffect, useState } from "react";

/** The header's LCD clock (local time, HH:MM). Hidden until the first tick so it never shows blank digits. */
export function Clock() {
	const [time, setTime] = useState<string | null>(null);

	useEffect(() => {
		const tick = () => {
			const now = new Date();
			setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, []);

	const digits = time ? time.replace(":", "") : "";
	const digit = (i: number) => (
		<span data-ghost="8" className="relative before:absolute before:inset-0 before:opacity-[0.04] before:content-[attr(data-ghost)]">
			{digits[i]}
		</span>
	);

	return (
		<time
			data-clock
			role="img"
			aria-label={time ? `Local time ${time}` : "Local time"}
			dateTime={time ?? undefined}
			hidden={!time}
			className="relative grid w-[clamp(3.5rem,16vw,4rem)] flex-none aspect-[16/7] p-[0.75px] text-ink [font:700_calc(clamp(3.5rem,16vw,4rem)*14/64)/1_'Portfolio_LCD',ui-monospace,monospace] select-none [--cut:6px] before:absolute before:inset-0 before:bg-black before:content-[''] before:clip-octagon"
		>
			<span
				aria-hidden="true"
				className="grid grid-cols-[repeat(2,9.5fr)_7fr_repeat(2,9.5fr)] items-center bg-[#dcdcdc] px-[0.38em] text-center [--cut:5.56px] clip-octagon"
			>
				{digit(0)}
				{digit(1)}
				<span className="opacity-65">:</span>
				{digit(2)}
				{digit(3)}
			</span>
		</time>
	);
}
