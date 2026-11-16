"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Icon } from "../icon";

export type Category = "projects" | "experience" | "achievements" | "oss";
export type DeckCard = { category: Category; title: string; content: ReactNode };

const CATEGORIES: [Category, string][] = [
	["projects", "Projects"],
	["experience", "Experience"],
	["achievements", "Achievements"],
	["oss", "Open Source"],
];
const ITEM_TYPE: Record<Category, string> = { projects: "project", experience: "experience entry", achievements: "achievement", oss: "open-source summary" };
// Shared skeleton: title row on top, content fills the middle, a bottom row (when present) pins to the bottom.
// The open-source card never sets the deck's height (contain: size); it fills what the other cards give it.
const ROWS: Record<Category, string> = {
	projects: "grid-rows-[auto_auto_1fr]",
	experience: "grid-rows-[auto_1fr_auto]",
	achievements: "grid-rows-[auto_1fr]",
	oss: "[contain:size] grid-rows-[auto_auto_minmax(0,1fr)_auto]",
};
const BUTTON = "min-h-tap border-0 bg-transparent [touch-action:manipulation] hover:bg-hover";
const slide = (offset: number) => `translate3d(${offset}px, 0, 0)`;

type Swipe = {
	id: number;
	x: number;
	y: number;
	started: number;
	width: number;
	current: HTMLElement;
	neighbor?: HTMLElement;
	direction: number;
	offset: number;
	animations?: Animation[];
};

/**
 * The home deck: one card per project/experience/achievement plus an open-source summary, switched by a
 * category strip (drifting marquee until first touch), previous/next buttons and horizontal swipes.
 */
export function Deck({ cards }: { cards: DeckCard[] }) {
	const [state, setState] = useState({
		category: "projects" as Category,
		indices: { projects: 0, experience: 0, achievements: 0, oss: 0 } as Record<Category, number>,
		// bumped when a card is left, so its content remounts (a playing demo goes back to its thumbnail)
		epochs: {} as Record<string, number>,
		status: "",
	});
	const [clones, setClones] = useState(false);
	const trackRef = useRef<HTMLDivElement>(null);
	const stripRef = useRef<HTMLDivElement>(null);
	const stripTrackRef = useRef<HTMLDivElement>(null);
	const cardRefs = useRef<HTMLElement[]>([]);
	const resetSwipe = useRef(() => {});

	const groups = Object.fromEntries(CATEGORIES.map(([c]) => [c, cards.flatMap((card, i) => (card.category === c ? [i] : []))])) as Record<Category, number[]>;
	const { category, indices } = state;
	const count = groups[category].length;
	const activeCard = groups[category][indices[category]];

	function select(next: Category, index: number) {
		setState((s) => {
			const left = groups[s.category][s.indices[s.category]];
			const entered = groups[next][index];
			const epochs = left === entered ? s.epochs : { ...s.epochs, [left]: (s.epochs[left] ?? 0) + 1 };
			const total = groups[next].length;
			return { category: next, indices: { ...s.indices, [next]: index }, epochs, status: `${cards[entered].title}. ${index + 1} of ${total}.` };
		});
	}

	// Latest state for the native gesture listeners below.
	const live = useRef({ state, groups, select });
	useLayoutEffect(() => {
		live.current = { state, groups, select };
	});

	// Swipe between cards with a preview of the neighbour (touch only; mouse uses the buttons).
	useEffect(() => {
		const track = trackRef.current!;
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let swipe: Swipe | null = null;
		const items = () => live.current.groups[live.current.state.category];
		const deckIndex = (direction: number) => {
			const { state: s, groups: g } = live.current;
			const n = g[s.category].length;
			return (s.indices[s.category] + direction + n) % n;
		};
		const reset = () => {
			if (!swipe) return;
			const { current, neighbor, animations } = swipe;
			swipe = null;
			animations?.forEach((animation) => animation.cancel());
			current.style.transform = "";
			if (neighbor) neighbor.style.transform = neighbor.style.visibility = "";
		};
		const move = (direction: number) => {
			const { state: s, select } = live.current;
			flushSync(() => select(s.category, deckIndex(direction)));
			reset();
		};

		const onStart = (event: TouchEvent) => {
			if (event.touches.length !== 1 || swipe || items().length < 2) return;
			const touch = event.touches[0];
			const { state: s, groups: g } = live.current;
			swipe = {
				id: touch.identifier,
				x: touch.clientX,
				y: touch.clientY,
				started: event.timeStamp,
				width: track.clientWidth,
				current: cardRefs.current[g[s.category][s.indices[s.category]]],
				direction: 0,
				offset: 0,
			};
		};
		const onMove = (event: TouchEvent) => {
			if (!swipe || swipe.animations) return;
			if (event.touches.length !== 1) return reset();
			const touch = event.touches[0];
			if (swipe.id !== touch.identifier) return;
			const dx = touch.clientX - swipe.x;
			const dy = Math.abs(touch.clientY - swipe.y);
			if (!swipe.direction) {
				if (dy > 10 && dy >= Math.abs(dx)) return reset();
				if (Math.abs(dx) < 10 || Math.abs(dx) < dy * 1.25) return;
			}
			if (event.cancelable) event.preventDefault();

			const direction = dx <= 0 ? 1 : -1;
			if (direction !== swipe.direction) {
				if (swipe.neighbor) swipe.neighbor.style.transform = swipe.neighbor.style.visibility = "";
				swipe.direction = direction;
				swipe.neighbor = cardRefs.current[items()[deckIndex(direction)]];
			}
			swipe.offset = Math.max(-swipe.width, Math.min(swipe.width, dx));
			if (!reducedMotion.matches) {
				swipe.current.style.transform = slide(swipe.offset);
				swipe.neighbor!.style.transform = slide(swipe.offset + direction * swipe.width);
				swipe.neighbor!.style.visibility = "visible";
			}
		};
		const onEnd = (event: TouchEvent) => {
			const gesture = swipe;
			if (!gesture || gesture.id !== event.changedTouches[0]?.identifier || gesture.animations) return;
			const { direction, offset, width, started, current, neighbor } = gesture;
			if (!direction) return reset();
			if (event.cancelable) event.preventDefault();

			const distance = Math.abs(offset);
			const quickSwipe = distance >= 28 && distance / Math.max(1, event.timeStamp - started) >= 0.45;
			const advance = distance >= Math.min(72, width * 0.22) || quickSwipe;
			const finish = () => {
				if (swipe !== gesture) return;
				if (advance) move(direction);
				else reset();
			};
			if (reducedMotion.matches) return finish();

			const end = advance ? -direction * width : 0;
			const options: KeyframeAnimationOptions = { duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" };
			gesture.animations = [
				current.animate([{ transform: slide(offset) }, { transform: slide(end) }], options),
				neighbor!.animate([{ transform: slide(offset + direction * width) }, { transform: slide(end + direction * width) }], options),
			];
			gesture.animations[0].onfinish = finish;
		};

		track.addEventListener("touchstart", onStart, { passive: true });
		track.addEventListener("touchmove", onMove, { passive: false });
		track.addEventListener("touchend", onEnd, { passive: false });
		track.addEventListener("touchcancel", reset);
		resetSwipe.current = reset;
		return () => {
			reset();
			track.removeEventListener("touchstart", onStart);
			track.removeEventListener("touchmove", onMove);
			track.removeEventListener("touchend", onEnd);
			track.removeEventListener("touchcancel", reset);
		};
	}, []);

	// Category marquee: the labels drift across the strip until the first touch, click, wheel or key press,
	// then it stops for good and the strip is an ordinary (mouse-draggable) row. Reduced motion never starts it.
	useEffect(() => {
		const strip = stripRef.current!;
		const track = stripTrackRef.current!;
		let stopped = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let frame = 0;
		let idle = 0;
		const stop = () => {
			if (stopped) return;
			stopped = true;
			cancelAnimationFrame(frame);
		};

		let drag: { id: number; x: number; scrollLeft: number } | null = null;
		const onDown = (event: PointerEvent) => {
			stop();
			if (event.pointerType !== "mouse" || event.button !== 0 || strip.scrollWidth <= strip.clientWidth) return;
			drag = { id: event.pointerId, x: event.clientX, scrollLeft: strip.scrollLeft };
		};
		const onDrag = (event: PointerEvent) => {
			if (!drag || event.pointerId !== drag.id) return;
			const distance = drag.x - event.clientX;
			if (!strip.hasPointerCapture(event.pointerId)) {
				if (Math.abs(distance) < 6) return;
				strip.setPointerCapture(event.pointerId);
				strip.dataset.grabbing = "";
			}
			strip.scrollLeft = drag.scrollLeft + distance;
		};
		const endDrag = (event: PointerEvent) => {
			if (drag?.id !== event.pointerId) return;
			drag = null;
			delete strip.dataset.grabbing;
		};
		const onLeave = (event: PointerEvent) => {
			if (!strip.hasPointerCapture(event.pointerId)) endDrag(event);
		};
		strip.addEventListener("pointerdown", onDown);
		strip.addEventListener("pointermove", onDrag);
		strip.addEventListener("pointerup", endDrag);
		strip.addEventListener("pointercancel", endDrag);
		strip.addEventListener("lostpointercapture", endDrag);
		strip.addEventListener("pointerleave", onLeave);
		const stopEvents = ["touchstart", "wheel", "keydown", "focusin"];

		let observer: ResizeObserver | undefined;
		const startDrift = () => {
			if (!stopped) frame = requestAnimationFrame(drift);
		};
		const whenIdle = (fn: () => void) => (idle = "requestIdleCallback" in window ? requestIdleCallback(fn) : setTimeout(fn, 1) as unknown as number);
		const onLoad = () => whenIdle(startDrift);
		// Width of one set of labels (where the copies begin); measured only when the strip resizes, never per frame.
		let repeatAt = 0;
		let offset = 0;
		let lastFrame = 0;
		const drift = (now: number) => {
			const elapsed = lastFrame ? now - lastFrame : 0;
			lastFrame = now;
			offset += elapsed * 0.04; // 40 px per second
			if (repeatAt > 0 && offset >= repeatAt) offset -= repeatAt;
			strip.scrollLeft = offset;
			frame = requestAnimationFrame(drift);
		};
		if (!stopped) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- reduced motion is only known in the browser
			setClones(true);
			for (const name of stopEvents) strip.addEventListener(name, stop, { passive: true });
			observer = new ResizeObserver(() => {
				const copy = track.children[CATEGORIES.length] as HTMLElement | undefined;
				repeatAt = copy ? copy.offsetLeft - (track.children[0] as HTMLElement).offsetLeft : 0;
			});
			observer.observe(track);
			if (document.readyState === "complete") onLoad();
			else window.addEventListener("load", onLoad, { once: true });
		}
		return () => {
			stopped = true;
			cancelAnimationFrame(frame);
			if ("cancelIdleCallback" in window) cancelIdleCallback(idle);
			else clearTimeout(idle);
			observer?.disconnect();
			window.removeEventListener("load", onLoad);
			for (const name of stopEvents) strip.removeEventListener(name, stop);
			strip.removeEventListener("pointerdown", onDown);
			strip.removeEventListener("pointermove", onDrag);
			strip.removeEventListener("pointerup", endDrag);
			strip.removeEventListener("pointercancel", endDrag);
			strip.removeEventListener("lostpointercapture", endDrag);
			strip.removeEventListener("pointerleave", onLeave);
		};
	}, []);

	const choose = (next: Category, index: number) => {
		resetSwipe.current(); // a click mid-swipe drops the gesture
		select(next, index);
	};
	const itemType = ITEM_TYPE[category];
	const categoryButton = ([name, label]: [Category, string], copy: boolean) => {
		const active = name === category;
		return (
			<button
				key={`${copy ? "copy-" : ""}${name}`}
				type="button"
				data-category={copy ? undefined : name}
				aria-pressed={copy ? undefined : active}
				aria-hidden={copy || undefined}
				tabIndex={copy ? -1 : undefined}
				aria-controls="deck-content"
				disabled={groups[name].length === 0}
				onClick={() => choose(name, indices[name])}
				className={`${BUTTON} flex-none border-x-0 border-t-0 border-b-2 px-[0.35rem] text-[0.875rem] whitespace-nowrap focus-visible:outline-offset-[-2px] ${active ? "border-b-ink font-[690] text-ink" : "border-b-transparent text-muted"}`}
			>
				{label}
			</button>
		);
	};

	return (
		<section aria-label="Selected work" className="my-4 border border-line px-3 pt-3">
			<div
				ref={trackRef}
				id="deck-content"
				className="grid grid-cols-[minmax(0,1fr)] overflow-clip [overflow-clip-margin:4px] [touch-action:pan-y_pinch-zoom]"
			>
				{cards.map(({ category: kind, content }, i) => {
					const active = i === activeCard;
					return (
						<div
							key={i}
							ref={(el) => {
								if (el) cardRefs.current[i] = el;
							}}
							inert={!active}
							className={`grid grid-cols-[minmax(0,1fr)] [grid-area:1/1] ${ROWS[kind]} ${active ? "" : "invisible"}`}
						>
							<Fragment key={state.epochs[i] ?? 0}>{content}</Fragment>
						</div>
					);
				})}
			</div>
			<p role="status" className="absolute h-px w-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]">
				{state.status}
			</p>
			<div className="mt-[0.35rem] flex flex-wrap items-center gap-x-2">
				<div
					ref={stripRef}
					role="group"
					aria-label="Work category"
					className="flex min-w-0 max-w-[12.5rem] flex-[1_1_9rem] overflow-x-auto overflow-y-hidden overscroll-x-contain scrollbar-none [touch-action:pan-x] select-none [mask-image:linear-gradient(to_right,transparent,#000_0.5rem,#000_calc(100%-0.5rem),transparent)] data-grabbing:[&_button]:cursor-grabbing"
				>
					<div ref={stripTrackRef} className="flex flex-none gap-[0.65rem]">
						{CATEGORIES.map((c) => categoryButton(c, false))}
						{/* Decorative copies for the marquee loop: hidden from assistive tech, not focusable. */}
						{clones && CATEGORIES.map((c) => categoryButton(c, true))}
					</div>
				</div>
				<div
					hidden={count < 2}
					className="ms-auto grid grid-cols-[var(--spacing-tap)_minmax(2.4rem,max-content)_var(--spacing-tap)] items-center text-center"
				>
					<button type="button" aria-label={`Previous ${itemType}`} onClick={() => choose(category, (indices[category] - 1 + count) % count)} className={`${BUTTON} grid min-w-tap place-items-center p-0`}>
						<Icon name="previous" className="pointer-events-none size-[1.15rem]" />
					</button>
					<span className="text-[0.75rem] whitespace-nowrap text-muted tabular-nums">{`${indices[category] + 1} / ${count}`}</span>
					<button type="button" aria-label={`Next ${itemType}`} onClick={() => choose(category, (indices[category] + 1) % count)} className={`${BUTTON} grid min-w-tap place-items-center p-0`}>
						<Icon name="next" className="pointer-events-none size-[1.15rem]" />
					</button>
				</div>
			</div>
		</section>
	);
}
