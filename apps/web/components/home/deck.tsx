"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { Icon } from "../icon";

export type Category = "projects" | "experience" | "achievements" | "oss";
export type DeckCard = { category: Category; title: string; footerTitle?: ReactNode; content: ReactNode };

const CATEGORIES: [Category, string][] = [
	["projects", "Projects"],
	["experience", "Experience"],
	["achievements", "Achievements"],
	["oss", "Open Source"],
];
const ITEM_TYPE: Record<Category, string> = { projects: "project", experience: "experience entry", achievements: "achievement", oss: "open-source summary" };
// Project and experience titles share the footer with navigation; their content stays in the swipe area.
// The open-source card never sets the deck's height (contain: size); it fills what the other cards give it.
const ROWS: Record<Category, string> = {
	projects: "grid-rows-[auto_1fr]",
	experience: "grid-rows-[1fr]",
	achievements: "grid-rows-[1fr]",
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
 * static category buttons above the card, previous/next controls below it and horizontal swipes.
 */
export function Deck({ cards }: { cards: DeckCard[] }) {
	const [state, setState] = useState({
		category: "projects" as Category,
		indices: { projects: 0, experience: 0, achievements: 0, oss: 0 } as Record<Category, number>,
		// bumped when a card is left, so its content remounts (a playing demo goes back to its thumbnail)
		epochs: {} as Record<string, number>,
		status: "",
	});
	const trackRef = useRef<HTMLDivElement>(null);
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

	const choose = (next: Category, index: number) => {
		resetSwipe.current(); // a click mid-swipe drops the gesture
		select(next, index);
	};
	const itemType = ITEM_TYPE[category];
	const categoryButton = ([name, label]: [Category, string]) => {
		const active = name === category;
		return (
			<button
				key={name}
				type="button"
				data-category={name}
				aria-pressed={active}
				aria-controls="deck-content"
				disabled={groups[name].length === 0}
				onClick={() => choose(name, indices[name])}
				className={`${BUTTON} min-w-max flex-auto border-x-0 border-t-0 border-b-2 px-1 text-[0.8125rem] whitespace-nowrap focus-visible:outline-offset-[-2px] @min-[24rem]:flex-1 ${active ? "border-b-ink font-[690] text-ink" : "border-b-transparent text-muted"}`}
			>
				{label}
			</button>
		);
	};

	return (
		<section aria-label="Selected work" className="@container my-4 border border-line px-3">
			<div
				role="group"
				aria-label="Work category"
				className="-mx-3 mb-3 flex flex-nowrap overflow-x-auto overscroll-x-contain border-b border-line @min-[24rem]:gap-x-2 @min-[24rem]:px-3"
			>
				{CATEGORIES.map(categoryButton)}
			</div>
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
			<div className="mt-2 grid min-h-[calc(var(--spacing-tap)+1px)] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-line-soft">
				{/* Measure every title at the same width so wrapping cannot move the footer. */}
				<div className="grid min-w-0 items-center">
					{cards.map(({ footerTitle }, i) => footerTitle && (
						<div key={i} inert={i !== activeCard} className={`min-w-0 [grid-area:1/1] ${i === activeCard ? "" : "invisible"}`}>
							{footerTitle}
						</div>
					))}
				</div>
				<div className="w-[calc(var(--spacing-tap)*2+2.4rem)]">
					{category === "oss" && (
						<Link href="/open-source" aria-label="All open-source work" className="ms-auto flex min-h-tap w-fit items-center gap-1 px-1 text-[0.875rem]">
							All <Icon name="next" className="pointer-events-none size-4" />
						</Link>
					)}
					{count > 1 && (
						<div role="group" aria-label="Card navigation" className="grid grid-cols-[var(--spacing-tap)_1fr_var(--spacing-tap)] items-center text-center">
							<button type="button" aria-label={`Previous ${itemType}`} aria-controls="deck-content" onClick={() => choose(category, (indices[category] - 1 + count) % count)} className={`${BUTTON} grid min-w-tap place-items-center p-0`}>
								<Icon name="previous" className="pointer-events-none size-[1.15rem]" />
							</button>
							<span aria-label={`${CATEGORIES.find(([name]) => name === category)?.[1]} ${indices[category] + 1} of ${count}`} className="text-[0.75rem] whitespace-nowrap text-muted tabular-nums">{`${indices[category] + 1} / ${count}`}</span>
							<button type="button" aria-label={`Next ${itemType}`} aria-controls="deck-content" onClick={() => choose(category, (indices[category] + 1) % count)} className={`${BUTTON} grid min-w-tap place-items-center p-0`}>
								<Icon name="next" className="pointer-events-none size-[1.15rem]" />
							</button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
