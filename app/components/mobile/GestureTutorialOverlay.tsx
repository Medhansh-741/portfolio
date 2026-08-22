"use client";

import { useEffect } from "react";
import { useSpring, useTrail, animated } from "@react-spring/web";

const TRAIL_LENGTH = 5;

export default function GestureTutorialOverlay() {
	// The driving physics spring: This holds the actual x/y values 
	// and broadcasts them via CustomEvent on every frame.
	const [, driverApi] = useSpring(() => ({
		x: 0,
		y: 0,
		config: { mass: 1, tension: 170, friction: 40 },
		onChange: ({ value }) => {
			// Broadcast the position exactly to the engine
			window.dispatchEvent(
				new CustomEvent("tutorial-peek", {
					detail: { mx: value.x, my: value.y, snap: value.x === 0 && value.y === 0 },
				})
			);
			
			// Command the visual trail to chase this coordinate
			trailApi.start({ x: value.x, y: value.y });
		},
	}));

	// The visual motion trail: Uses React Spring's staggered trail physics
	const [trail, trailApi] = useTrail(TRAIL_LENGTH, () => ({
		x: 0,
		y: 0,
		scale: 0,
		opacity: 0,
		config: { mass: 0.8, tension: 300, friction: 25 },
	}));

	useEffect(() => {
		let isCancelled = false;

		const runTutorial = async () => {
			const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

			// Give the user 3 seconds to look at the screen before running tutorial
			await delay(3000);

			while (!isCancelled) {
				// We derive sizing dynamically at runtime per mobile rulebook (no hardcoded px logic)
				const peekX = window.innerWidth * 0.28; 
				const peekY = window.innerHeight * 0.15;

				// Phase 1: Fade in the touch indicator
				trailApi.start({ opacity: 0.7, scale: 1 });
				await delay(500);

				if (isCancelled) break;
				// Phase 2: Swipe Right (Horizontal Peeek)
				driverApi.start({ x: peekX, y: 0, config: { tension: 170, friction: 40 } });
				await delay(1200);

				if (isCancelled) break;
				// Phase 3: Snap Back
				driverApi.start({ x: 0, y: 0, config: { tension: 400, friction: 30 } });
				await delay(800);

				if (isCancelled) break;
				// Phase 4: Swipe Down (Vertical Peep)
				driverApi.start({ x: 0, y: peekY, config: { tension: 170, friction: 40 } });
				await delay(1200);

				if (isCancelled) break;
				// Phase 5: Snap Back
				driverApi.start({ x: 0, y: 0, config: { tension: 400, friction: 30 } });
				
				// Phase 6: Fade out and rest before repeating
				trailApi.start({ opacity: 0, scale: 0 });
				await delay(2500);
			}
		};

		runTutorial();

		const cancelTutorial = () => {
			isCancelled = true;
			trailApi.start({ opacity: 0, scale: 0, immediate: true });
			// Ensure engine is commanded to snap back immediately if interrupted
			window.dispatchEvent(
				new CustomEvent("tutorial-peek", {
					detail: { mx: 0, my: 0, snap: true },
				})
			);
		};

		// If a real human touches the screen, kill the puppet master permanently
		window.addEventListener("touchstart", cancelTutorial, { passive: true, once: true });
		window.addEventListener("mousedown", cancelTutorial, { passive: true, once: true });

		return () => {
			isCancelled = true;
			window.removeEventListener("touchstart", cancelTutorial);
			window.removeEventListener("mousedown", cancelTutorial);
		};
	}, [driverApi, trailApi]);

	return (
		<div className="absolute inset-0 pointer-events-none z-[100] overflow-visible">
			{trail.map((style, i) => (
				<animated.div
					key={i}
					className="absolute top-[45%] left-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full pointer-events-none bg-accent"
					style={{
						...style,
						opacity: style.opacity.to((o) => o * (1 - i / TRAIL_LENGTH)),
						scale: style.scale.to((s) => s * (1 - i * 0.15)),
						zIndex: 100 - i,
						boxShadow: i === 0 
							? "0 0 25px 8px rgba(255, 255, 255, 0.3), inset 0 0 10px rgba(255,255,255,0.8)" 
							: "none",
					}}
				/>
			))}
		</div>
	);
}
