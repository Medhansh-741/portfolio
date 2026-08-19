"use client";

import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { useSprings, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { CardDeckContext } from "./CardDeckVideo";

interface CardStackEngineProps {
	projectCards: React.ReactNode[];
	experienceCards: React.ReactNode[];
}

const ENGINE_SHAPE_CLASSES = "w-11/12 max-w-sm mx-auto aspect-[5/7]";
const NUM_PHYSICAL_CARDS = 5;

// Pre-calculate static visual rotations for the 5 depth slots to prevent hydration jitter.
const STATIC_ROTATIONS = [0, 2, 1, 0, 0];

export default function CardStackEngine({ projectCards, experienceCards }: CardStackEngineProps) {
	const [activeDeckType, setActiveDeckType] = useState<"projects" | "experience">("projects");
	
	const activeCards = activeDeckType === "projects" ? projectCards : experienceCards;
	const inactiveCards = activeDeckType === "projects" ? experienceCards : projectCards;

	const [projectOffset, setProjectOffset] = useState(0);
	const [experienceOffset, setExperienceOffset] = useState(0);

	const activeOffset = activeDeckType === "projects" ? projectOffset : experienceOffset;
	const inactiveOffset = activeDeckType === "projects" ? experienceOffset : projectOffset;

	const [dragDirection, setDragDirection] = useState<"next" | "prev">("next");

	// Tracks the physical DOM nodes mapped to their current depth slot (0 is front, 4 is back)
	const orderRef = useRef([0, 1, 2, 3, 4]);

	// Lock gesture intent so dragging diagonally doesn't jitter
	const intentRef = useRef<"horizontal" | "vertical" | null>(null);

	// Flag to suppress the useEffect reset during our custom 3D swap animation
	const isVerticalSwapRef = useRef(false);

	// Resolves the exact data to render for a given virtual index, wrapping around the array infinitely
	const getCardData = (dataIndex: number, deck: React.ReactNode[]) => {
		if (!deck || deck.length === 0) return null;
		const wrappedIndex = ((dataIndex % deck.length) + deck.length) % deck.length;
		return deck[wrappedIndex];
	};

	// 5 Physical Springs representing the active DOM nodes
	const [springs, api] = useSprings(NUM_PHYSICAL_CARDS, i => {
		const pos = orderRef.current.indexOf(i);
		return {
			x: 0, y: 0, scale: 1, 
			rotZ: STATIC_ROTATIONS[pos],
			rotY: 0,
			opacity: 1, zIndex: NUM_PHYSICAL_CARDS - pos,
			config: { friction: 50, tension: 500 }
		};
	});

	// Hard Reset when switching between Projects/Experience decks manually
	useEffect(() => {
		if (isVerticalSwapRef.current) {
			isVerticalSwapRef.current = false;
			return;
		}

		setProjectOffset(0);
		setExperienceOffset(0);
		setDragDirection("next");
		orderRef.current = [0, 1, 2, 3, 4];
		api.start(i => {
			const pos = orderRef.current.indexOf(i);
			return {
				x: 0, y: 0, rotY: 0,
				scale: 1,
				rotZ: STATIC_ROTATIONS[pos],
				opacity: 1,
				zIndex: NUM_PHYSICAL_CARDS - pos,
				immediate: true
			};
		});
	}, [activeDeckType, api]);

	const bind = useDrag(({ args: [index], active, movement: [mx, my], velocity: [vx, vy], initial: [ix, iy], first }) => {
		if (isVerticalSwapRef.current) return;
		const pos = orderRef.current.indexOf(index);
		if (pos !== 0) return; // Only allow grabbing the top card

		// Lock gesture intent instantly to prevent glitching between slide and throw
		if (first) {
			intentRef.current = Math.abs(mx) > Math.abs(my) ? "horizontal" : "vertical";
		}
		
		const isVertical = intentRef.current === "vertical";
		const grabbedTopHalf = iy < window.innerHeight / 2;
		const pivotFactor = grabbedTopHalf ? 1 : -1;

		// ==========================================
		// VERTICAL LOGIC: The Heavy Layer Slide
		// ==========================================
		if (isVertical) {
			const dragDistance = Math.abs(my);
			const isDown = my > 0;
			
			// Phase 1: Lifting the deck (0 to 150px drag)
			const progress = Math.min(dragDistance / 150, 1); 
			const currentScale = 1 + (progress * 0.05); // Max lift 1.05

			// Release Check (Bi-directional support)
			const isSwipeComplete = !active && dragDistance > 150;

			if (isSwipeComplete) {
				const runLayerSwap = async () => {
					// 1. Force the active deck completely off the screen
					const outPromises = api.start(i => {
						const currentPos = orderRef.current.indexOf(i);
						return {
							y: 800 * (isDown ? 1 : -1),
							opacity: 0,
							rotZ: STATIC_ROTATIONS[currentPos], // Keep it wonderfully messy as it flies away!
							scale: 1.05,
							config: { mass: 1, tension: 300, friction: 30 }
						};
					});
					await Promise.all(Array.isArray(outPromises) ? outPromises : [outPromises]);

					// 2. Trigger React State Swap synchronously to prevent 1-frame teleport flicker
					flushSync(() => {
						isVerticalSwapRef.current = true;
						setActiveDeckType(prev => prev === "projects" ? "experience" : "projects");
						orderRef.current = [0, 1, 2, 3, 4]; // Reset logical array
					});
					
					// 3. Teleport new deck perfectly to the exact resting state of the passive deck
					// We use scale 1.0 so there is no visual bouncing or shrinking when it takes focus. It is perfectly seamless!
					api.start(j => ({
						y: 0, rotZ: STATIC_ROTATIONS[j], scale: 1, opacity: 1,
						immediate: true
					}));
				};
				
				runLayerSwap();
				intentRef.current = null; // Clear intent
				return;
			}

			// Interactive scrubbing: imperative set (no spring re-solve per frame)
			if (active) {
				api.set(i => {
					const currentPos = orderRef.current.indexOf(i);
					return {
						y: my,
						rotZ: STATIC_ROTATIONS[currentPos],
						scale: currentScale,
						opacity: 1,
						rotY: 0, x: 0,
					};
				});
			} else {
				// Released without completing the swipe — spring back to rest
				api.start(i => {
					const currentPos = orderRef.current.indexOf(i);
					return {
						y: 0,
						rotZ: STATIC_ROTATIONS[currentPos],
						scale: 1,
						opacity: 1,
						rotY: 0, x: 0,
						config: { tension: 500, friction: 50 },
					};
				});
			}
			
			if (!active) intentRef.current = null;
			return; 
		}

		// ==========================================
		// HORIZONTAL LOGIC: The Light Card Throw
		// ==========================================
		if (active) {
			const currentDir = mx < 0 ? "prev" : "next";
			if (dragDirection !== currentDir) {
				setDragDirection(currentDir);
			}
		}

		const isSwipe = !active && (vx > 0.5 || Math.abs(mx) > 100);

		if (isSwipe) {
			const dir = mx < 0 ? -1 : 1;
			const isNext = dir === 1;

			api.start(i => {
				const currentPos = orderRef.current.indexOf(i);

				if (currentPos === 0) {
					return {
						x: 250 * dir, 
						y: Math.abs(mx) * 0.2 + 100, 
						rotZ: (mx / 10) * pivotFactor + (dir * 20 * vx),
						rotY: dir * 60 * vx, 
						scale: 0.5, 
						opacity: 0, 
						config: { friction: 40, tension: 350 }, 
						onRest: () => {
							const newOrder = [...orderRef.current];
							const shifted = newOrder.shift() as number;
							newOrder.push(shifted);
							orderRef.current = newOrder;

							if (activeDeckType === "projects") {
								setProjectOffset(prev => prev + (isNext ? 1 : -1));
							} else {
								setExperienceOffset(prev => prev + (isNext ? 1 : -1));
							}
							setDragDirection("next");

							api.start(j => {
								const newPos = orderRef.current.indexOf(j);
								if (newPos === NUM_PHYSICAL_CARDS - 1) { 
									return {
										x: 0, y: 0, rotY: 0,
										scale: 1, 
										rotZ: STATIC_ROTATIONS[newPos],
										opacity: 1, 
										zIndex: NUM_PHYSICAL_CARDS - newPos,
										immediate: true
									};
								}
								return { zIndex: NUM_PHYSICAL_CARDS - newPos, immediate: true };
							});
						}
					};
				}

				return {
					scale: 1,
					rotZ: STATIC_ROTATIONS[currentPos - 1],
					config: { friction: 40, tension: 300 }
				};
			});
			
			intentRef.current = null;
			return;
		}

		// Interactive dragging: imperative set (no spring re-solve per frame)
		if (active) {
			api.set(i => {
				const currentPos = orderRef.current.indexOf(i);

				if (currentPos === 0) {
					return {
						x: mx,
						y: Math.abs(mx) * 0.1,
						rotZ: (mx / 20) * pivotFactor,
						rotY: 0,
						scale: 1.02,
					};
				}

				if (currentPos < 3) {
					return {
						rotZ: STATIC_ROTATIONS[currentPos] + (mx / 300),
						scale: 1,
					};
				}
				return {};
			});
		} else {
			// Released — spring back to rest
			api.start(i => {
				const currentPos = orderRef.current.indexOf(i);
				return {
					x: 0,
					y: 0,
					rotZ: STATIC_ROTATIONS[currentPos],
					rotY: 0,
					scale: 1,
					config: { friction: 50, tension: 500 },
				};
			});
		}
		
		if (!active) intentRef.current = null;
	}, { filterTaps: true }); // Capture both axes

	return (
		<div className="relative w-full mx-auto isolate mb-fluid-md select-none" style={{ perspective: "1500px", transformStyle: "preserve-3d" }}>
			
			{/* The Ghost Element: Holds container open securely */}
			{activeCards.length > 0 && (
				<div className={`relative invisible pointer-events-none opacity-0 ${ENGINE_SHAPE_CLASSES}`} />
			)}

			{/* The Shadow Plate */}
			{activeCards.length > 0 && (
				<div className="absolute inset-0 origin-center pointer-events-none" style={{ zIndex: -1 }}>
					<div className={`rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_0_12px_rgba(255,255,255,0.3)] bg-transparent ${ENGINE_SHAPE_CLASSES}`} />
				</div>
			)}

			{/* The Passive Inactive Deck (The "Peep" Fix) */}
			{/* Rendered physically behind the active deck so when you pull up, you see the actual new deck waiting beneath! */}
			{inactiveCards.length > 0 && (
				<div className="absolute inset-0 origin-center pointer-events-none" style={{ zIndex: 0 }}>
					{[0, 1, 2, 3, 4].map((index) => {
						const dataIndex = inactiveOffset + index;
						const card = getCardData(dataIndex, inactiveCards);
						if (!card) return null;
						return (
							<div
								key={`inactive-${index}`}
								className={`absolute top-0 left-0 right-0 mx-auto origin-center ${ENGINE_SHAPE_CLASSES}`}
								style={{ 
									transform: `rotateZ(${STATIC_ROTATIONS[index]}deg)`,
									zIndex: NUM_PHYSICAL_CARDS - index 
								}}
							>
								<CardDeckContext.Provider value={{ isTop: false }}>
									<div className="w-full h-full pointer-events-none overflow-hidden rounded-xl">
										{card}
									</div>
								</CardDeckContext.Provider>
							</div>
						);
					})}
				</div>
			)}

			{/* The Animated Physical Stack */}
			{springs.map(({ x, y, rotZ, rotY, scale, zIndex, opacity }, i) => {
				const positionInStack = orderRef.current.indexOf(i);
				const isTop = positionInStack === 0;

				const dirMult = dragDirection === "prev" ? -1 : 1;
				const dataIndex = activeOffset + (positionInStack * dirMult);
				const cardData = getCardData(dataIndex, activeCards);

				if (!cardData) return null;

				return (
					<animated.div
						key={i}
						{...(isTop ? bind(i) : {})} 
						className={`absolute top-0 left-0 right-0 mx-auto origin-center ${ENGINE_SHAPE_CLASSES}`}
						style={{
							zIndex, x, y, scale,
							rotateZ: rotZ, rotateY: rotY,
							opacity,
							pointerEvents: isTop ? "auto" : "none",
							cursor: isTop ? "grab" : "auto",
							touchAction: "none", // Hijack scroll for the vertical gesture!
							transformStyle: "preserve-3d"
						}}
					>
						<CardDeckContext.Provider value={{ isTop }}>
							<div className="relative w-full h-full pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto overflow-hidden rounded-xl">
								{cardData}
							</div>
						</CardDeckContext.Provider>
					</animated.div>
				);
			})}
		</div>
	);
}
