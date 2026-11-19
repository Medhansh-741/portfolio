"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from "react";

const FLIGHT_DURATION = 620;
const REBOUND_DURATION = 160;
const DURATION = FLIGHT_DURATION + REBOUND_DURATION;
// Keep the same playhead when navigation replaces the page's Shell.
let mergeStartedAt: number | null = null;
let launchPull = { x: 0, y: 0 };
let windupDuration = 0;
// In-memory only: route changes retain the visit; a full reload starts fresh.
let hasVisited = false;
const visitListeners = new Set<() => void>();
const subscribeToVisit = (listener: () => void) => {
	visitListeners.add(listener);
	return () => { visitListeners.delete(listener); };
};
const getVisited = () => hasVisited;
const getServerVisited = () => false;
const markVisited = () => {
	if (hasVisited) return;
	hasVisited = true;
	visitListeners.forEach((listener) => listener());
};
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);
const curve = (a: number, b: number, c: number, d: number, t: number) =>
	(1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
const drawStretch = (node: SVGCircleElement | null, x: number, y: number, pullX: number, pullY: number) => {
	const strength = clamp(Math.hypot(pullX, pullY) / 30);
	const angle = Math.atan2(pullY, pullX) * 180 / Math.PI;
	node?.setAttribute("transform", `translate(${x} ${y}) rotate(${angle}) scale(${1 + strength * 0.25} ${1 - strength * 0.15}) translate(${-x} ${-y})`);
};

export function OpenSourceNavLink({ current, className }: { current: boolean; className: string }) {
	const visited = useSyncExternalStore(subscribeToVisit, getVisited, getServerVisited);
	const router = useRouter();
	const merged = current || visited;
	const svg = useRef<SVGSVGElement>(null);
	const branch = useRef<SVGPathElement>(null);
	const node = useRef<SVGCircleElement>(null);
	const arrow = useRef<SVGPathElement>(null);
	const frame = useRef<number | null>(null);
	const pullAmount = useRef({ x: 0, y: 0 });
	const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
	const suppressClick = useRef(false);
	const link = useRef<HTMLAnchorElement>(null);

	const paintPull = useCallback((x: number, y: number) => {
		pullAmount.current = { x, y };
		const strength = clamp(Math.hypot(x, y) / 30);
		branch.current?.setAttribute("d", `M${18 + x} ${16.7 + y} C${18 + x * 0.7} ${12 + y * 0.6} ${18 + x * 0.2} ${8 + y * 0.15} 18 7 C18 5 15 5 12 5`);
		branch.current?.setAttribute("stroke-width", String(1.7 - 0.5 * strength));
		node.current?.setAttribute("cx", String(18 + x));
		node.current?.setAttribute("cy", String(19 + y));
		drawStretch(node.current, 18 + x, 19 + y, x, y);
	}, []);

	const relax = useCallback(() => {
		if (hasVisited || current) return;
		if (frame.current !== null) cancelAnimationFrame(frame.current);
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) { paintPull(0, 0); return; }
		const from = pullAmount.current;
		const startedAt = performance.now();
		const tick = () => {
			const progress = clamp((performance.now() - startedAt) / 180);
			paintPull(from.x * (1 - progress) ** 3, from.y * (1 - progress) ** 3);
			frame.current = progress < 1 ? requestAnimationFrame(tick) : null;
		};
		tick();
	}, [current, paintPull]);

	const paint = useCallback((progress: number) => {
		const time = progress * DURATION;
		const travel = clamp(time / FLIGHT_DURATION);
		const flight = travel * (1.25 - 0.25 * travel);
		const movement = clamp((travel - 0.76) / 0.24);
		const t = smooth(movement);
		const settle = clamp((time - FLIGHT_DURATION) / REBOUND_DURATION);
		const color = smooth(clamp(settle * 3));
		const releasePull = windupDuration > 0 ? { x: 4, y: 2 } : launchPull;
		const strength = clamp(Math.hypot(releasePull.x, releasePull.y) / 30);
		const recoil = (1 - clamp(time / 105)) ** 2;
		const rx = releasePull.x * recoil;
		const ry = releasePull.y * recoil;
		// Launch velocity opposes the pull. A shallow return curve guides the dot into the merge socket.
		const startX = 18 + releasePull.x;
		const startY = 19 + releasePull.y;
		const catchX = mix(43, 32, clamp(releasePull.x / 25));
		const launchX = startX - 2.7 * releasePull.x;
		const launchY = startY - 2.7 * releasePull.y;
		// Compensate for the launch angle so the return arc peeks above the bar.
		const catchY = -35 - launchY * 0.5 - Math.max(0, startY) * 0.08 - strength * 5;
		const rebound = Math.sin(2 * Math.PI * settle) * (1 - settle) ** 2 * mix(2.2, 4.2, strength);
		const x = curve(startX, launchX, catchX, 18, flight) - rebound * 0.25;
		const y = curve(startY, launchY, catchY, 13, flight) + rebound;
		branch.current?.setAttribute("stroke-width", String(1.7 - 0.5 * strength * recoil));
		branch.current?.setAttribute("d", `M${mix(18 + rx, 15.7, t)} ${mix(16.7 + ry, 13, t) + rebound} C${mix(18 + rx * 0.7, 12, t)} ${mix(12 + ry * 0.6, 13, t) + rebound * 0.55} ${mix(18 + rx * 0.2, 9, t)} ${mix(8 + ry * 0.15, 13, t)} ${mix(18, 7.5, t)} ${mix(7, 10, t)} C${mix(18, 6.5, t)} ${mix(5, 9, t)} ${mix(15, 6, t)} ${mix(5, 8, t)} ${mix(12, 6, t)} ${mix(5, 7.3, t)}`);
		node.current?.setAttribute("cx", String(x));
		node.current?.setAttribute("cy", String(y));
		drawStretch(node.current, x, y, rx, ry);
		const solid = smooth(clamp(flight / 0.12)) * smooth(clamp((1 - flight) / 0.12));
		node.current?.setAttribute("fill", "currentColor");
		node.current?.setAttribute("fill-opacity", String(solid));
		arrow.current?.setAttribute("transform", `translate(${mix(12, 6, t)} ${mix(5, 7.3, t)}) scale(${Math.max(0, 1 - movement / 0.7)})`);
		svg.current?.style.setProperty("color", `rgb(${mix(26, 130, color)} ${mix(127, 80, color)} ${mix(55, 223, color)})`);
	}, []);

	const play = useCallback(() => {
		if (frame.current !== null) cancelAnimationFrame(frame.current);
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			paint(1);
			return;
		}
		const startedAt = mergeStartedAt ?? performance.now();
		const tick = () => {
			const elapsed = performance.now() - startedAt;
			const progress = clamp((elapsed - windupDuration) / DURATION);
			if (elapsed < windupDuration) {
				paint(0);
				const amount = smooth(clamp(elapsed / windupDuration));
				paintPull(4 * amount, 2 * amount);
			}
			else paint(progress);
			frame.current = progress < 1 ? requestAnimationFrame(tick) : null;
		};
		tick();
	}, [paint, paintPull]);

	useLayoutEffect(() => {
		if (current) markVisited();
		if (merged) {
			if (mergeStartedAt !== null && performance.now() - mergeStartedAt < DURATION + windupDuration) play();
			else paint(1);
		} else {
			paint(0);
		}
		return () => { if (frame.current !== null) cancelAnimationFrame(frame.current); };
	}, [current, merged, paint, play]);

	const beginMerge = () => {
		launchPull = { ...pullAmount.current };
		windupDuration = Math.hypot(launchPull.x, launchPull.y) < 0.1 ? 120 : 0;
		mergeStartedAt = performance.now();
		markVisited();
		play();
	};

	const cancelPull = () => {
		const active = drag.current;
		if (active) suppressClick.current = true;
		drag.current = null;
		link.current?.style.removeProperty("cursor");
		if (active && link.current?.hasPointerCapture(active.id)) link.current.releasePointerCapture(active.id);
		relax();
	};

	return (
		<Link ref={link} href="/open-source" aria-label="Open Source" aria-current={current ? "page" : undefined}
			className={`${className} select-none touch-pan-y ${merged ? "" : "cursor-grab"}`}
			draggable={false}
			onDragStart={(event) => event.preventDefault()}
			onPointerDown={(event) => {
				if (merged || !event.isPrimary || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
				if (frame.current !== null) cancelAnimationFrame(frame.current);
				suppressClick.current = false;
				drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
				event.currentTarget.setPointerCapture(event.pointerId);
				event.currentTarget.style.cursor = "grabbing";
			}}
			onPointerMove={(event) => {
				const active = drag.current;
				if (!active || active.id !== event.pointerId) return;
				const dx = event.clientX - active.x;
				const dy = event.clientY - active.y;
				const distance = Math.hypot(dx, dy);
				if (distance < 4 && !active.moved) return;
				active.moved = true;
				if (distance < 0.01) { paintPull(0, 0); return; }
			const scale = 24 / (svg.current?.getBoundingClientRect().width || 18.4);
				const resisted = 30 * (1 - Math.exp(-distance * scale / 40));
				// Give an upward pull space past the bar while keeping downward pulls near the label.
				const x = dx / distance * resisted;
				const y = dy / distance * resisted;
				paintPull(x, y < 0 ? y * 1.32 : 7 * Math.tanh(y / 7));
			}}
			onPointerUp={(event) => {
				const active = drag.current;
				if (!active || active.id !== event.pointerId) return;
				drag.current = null;
				event.currentTarget.style.removeProperty("cursor");
				if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
				if (!active.moved) return;
				suppressClick.current = true;
				beginMerge();
				router.push("/open-source");
			}}
			onPointerCancel={cancelPull}
			onLostPointerCapture={() => { if (drag.current) cancelPull(); }}
			onKeyDown={(event) => {
				if (event.key === "Escape" && drag.current) { suppressClick.current = true; cancelPull(); }
			}}
			onClick={(event) => {
				if (suppressClick.current) {
					suppressClick.current = false;
					if (event.detail !== 0) event.preventDefault();
				}
			}}
			onNavigate={() => {
				if (merged) return;
				beginMerge();
			}}>
			<svg ref={svg} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`pointer-events-none block size-[1.15rem] overflow-visible ${merged ? "text-gh-merged" : "text-gh-open"}`}>
				<path d="M6 7.3V16.7" />
				<circle cx="6" cy="5" r="2.3" />
				<circle cx="6" cy="19" r="2.3" />
				<path ref={branch} d={merged ? "M15.7 13 C12 13 9 13 7.5 10 C6.5 9 6 8 6 7.3" : "M18 16.7 C18 12 18 8 18 7 C18 5 15 5 12 5"} />
				<path ref={arrow} d="M2 -2 0 0 2 2" transform={merged ? "translate(6 7.3) scale(0)" : "translate(12 5)"} />
				<circle ref={node} cx="18" cy={merged ? 13 : 19} r="2.3" />
			</svg>
			Open Source
		</Link>
	);
}
