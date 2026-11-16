"use client";

import { useRef, useState, type ReactNode } from "react";

/** Swipeable photo strip: scroll-snap track, dot markers, live "Photo n of N" status; arrow keys and mouse drag page it. */
export function Gallery({ label, count, children }: { label: string; count: number; children: ReactNode }) {
	const [current, setCurrent] = useState(0);
	const [dragging, setDragging] = useState(false);
	const drag = useRef<{ x: number; left: number; index: number } | null>(null);

	const photoIndex = (track: HTMLElement) =>
		Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
	const goToPhoto = (track: HTMLElement, index: number) =>
		track.scrollTo({
			left: index * track.clientWidth,
			behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
		});

	return (
		<div className="relative aspect-[3/2] bg-hover">
			<div
				tabIndex={0}
				role="group"
				aria-label={`${label} photos. Swipe or use the arrow keys to browse.`}
				className={`flex h-full overflow-x-auto [overscroll-behavior-inline:contain] scrollbar-none ${dragging ? "cursor-grabbing snap-none select-none" : "cursor-grab snap-x snap-mandatory"}`}
				onScroll={(event) => setCurrent(photoIndex(event.currentTarget))}
				onKeyDown={(event) => {
					if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
					if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
					event.preventDefault();
					goToPhoto(event.currentTarget, current + (event.key === "ArrowRight" ? 1 : -1));
				}}
				onPointerDown={(event) => {
					if (event.pointerType !== "mouse" || event.button !== 0) return;
					const track = event.currentTarget;
					drag.current = { x: event.clientX, left: track.scrollLeft, index: photoIndex(track) };
					track.setPointerCapture(event.pointerId);
					setDragging(true);
				}}
				onPointerMove={(event) => {
					if (!drag.current || event.pointerType !== "mouse") return;
					event.currentTarget.scrollLeft = drag.current.left + drag.current.x - event.clientX;
				}}
				onLostPointerCapture={(event) => {
					if (!drag.current) return;
					const track = event.currentTarget;
					const distance = track.scrollLeft - drag.current.left;
					const index =
						Math.abs(distance) > track.clientWidth * 0.2 ? drag.current.index + Math.sign(distance) : drag.current.index;
					drag.current = null;
					setDragging(false);
					goToPhoto(track, index);
				}}
			>
				{children}
			</div>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 rounded-[999px] bg-[rgb(0_0_0/55%)] px-[0.4rem] py-[0.28rem]"
			>
				{Array.from({ length: count }, (_, index) => (
					<span key={index} className={`size-[0.3rem] rounded-[50%] ${index === current ? "bg-[#fff]" : "bg-[rgb(255_255_255/50%)]"}`} />
				))}
			</div>
			<p role="status" className="absolute size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]">
				{`Photo ${current + 1} of ${count}`}
			</p>
		</div>
	);
}
