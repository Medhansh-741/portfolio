"use client";

import { useState } from "react";

interface CardStackEngineProps {
	projectCards: React.ReactNode[];
	experienceCards: React.ReactNode[];
}

export default function CardStackEngine({ projectCards, experienceCards }: CardStackEngineProps) {
	const [activeDeckType, setActiveDeckType] = useState<"projects" | "experience">("projects");

	const activeCards = activeDeckType === "projects" ? projectCards : experienceCards;

	// Create the illusion of a deck by repeating the cards up to 5 deep
	const displayCards = [...activeCards, ...activeCards, ...activeCards].slice(0, 5);

	// Rotational Top-Down Model: tighter, subtler physical angles
	// (Hardcoded to prevent Next.js hydration mismatch on Math.random)
	const angles = [0, -3, -2, +2];

	return (
		<div className="relative w-full mx-auto isolate mb-fluid-md">
			{/* The Ghost Element: props open the container to the active deck's natural fluid height */}
			{activeCards.length > 0 && (
				<div className="relative invisible pointer-events-none opacity-0">
					{activeCards[0]}
				</div>
			)}

			{/* The Shadow Plate (Physical Table Drop Shadow / Studio Rim Light) */}
			{displayCards.length > 0 && (
				<div
					className="absolute inset-0 origin-center pointer-events-none"
					style={{
						zIndex: 0,
						transform: `rotateZ(${angles[displayCards.length - 1] || 0}deg)`
					}}
				>
					<div className="w-11/12 max-w-sm mx-auto aspect-[5/7] rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_0_12px_rgba(255,255,255,0.3)] bg-transparent" />
				</div>
			)}

			{/* The Visual Stack (Dead UI) */}
			{displayCards.map((card, index) => {
				// We want 5 visible cards total
				const isVisible = index < 5;

				const rotateZ = angles[index] || 0;
				const zIndex = displayCards.length - index;

				return (
					<div
						key={index}
						className="absolute inset-0 origin-center"
						style={{
							zIndex,
							transform: `rotateZ(${rotateZ}deg)`,
							opacity: isVisible ? 1 : 0,
							pointerEvents: index === 0 ? "auto" : "none",
							transition: "transform 0.3s ease-out, opacity 0.3s ease-out"
						}}
					>
						{card}
					</div>
				);
			})}
		</div>
	);
}
