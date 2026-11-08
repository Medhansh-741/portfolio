const deck = document.querySelector("[data-deck]");
const deckTrack = deck.querySelector(".deck-track");
const categoryStrip = deck.querySelector("[data-categories]");
const categories = [...categoryStrip.querySelectorAll("[data-category]")];
const items = {
	projects: [...deck.querySelectorAll("[data-project]")],
	experience: [...deck.querySelectorAll("[data-experience]")],
	achievements: [...deck.querySelectorAll("[data-achievement]")],
};
const position = deck.querySelector("[data-position]");
const previous = deck.querySelector("[data-previous]");
const next = deck.querySelector("[data-next]");
const pagination = deck.querySelector("[data-pagination]");
const status = deck.querySelector("[data-deck-status]");
const indices = { projects: 0, experience: 0, achievements: 0 };
const itemTypes = { projects: "project", experience: "experience entry", achievements: "achievement" };
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let category = "projects";
let swipe = null;
let categoryDrag = null;

categoryStrip.addEventListener("pointerdown", (event) => {
	if (event.pointerType !== "mouse" || event.button !== 0 || categoryStrip.scrollWidth <= categoryStrip.clientWidth) return;
	categoryDrag = { id: event.pointerId, x: event.clientX, scrollLeft: categoryStrip.scrollLeft };
});

categoryStrip.addEventListener("pointermove", (event) => {
	if (!categoryDrag || event.pointerId !== categoryDrag.id) return;
	const distance = categoryDrag.x - event.clientX;
	if (!categoryStrip.hasPointerCapture(event.pointerId)) {
		if (Math.abs(distance) < 6) return;
		categoryStrip.setPointerCapture(event.pointerId);
		categoryStrip.dataset.dragging = "";
	}
	categoryStrip.scrollLeft = categoryDrag.scrollLeft + distance;
});

function endCategoryDrag(event) {
	if (categoryDrag?.id !== event.pointerId) return;
	categoryDrag = null;
	delete categoryStrip.dataset.dragging;
}

categoryStrip.addEventListener("pointerup", endCategoryDrag);
categoryStrip.addEventListener("pointercancel", endCategoryDrag);
categoryStrip.addEventListener("lostpointercapture", endCategoryDrag);
categoryStrip.addEventListener("pointerleave", (event) => {
	if (!categoryStrip.hasPointerCapture(event.pointerId)) endCategoryDrag(event);
});

function resetSwipe() {
	if (!swipe) return;
	const { current, neighbor, animations } = swipe;
	swipe = null;
	animations?.forEach((animation) => animation.cancel());
	current.style.transform = "";
	if (neighbor) {
		neighbor.style.transform = "";
		delete neighbor.dataset.swipePreview;
	}
}

function renderDeck(announce = false) {
	resetSwipe();
	const index = indices[category];
	const count = items[category].length;
	const item = items[category][index];
	const itemType = itemTypes[category];

	for (const [group, entries] of Object.entries(items)) {
		entries.forEach((entry, i) => {
			entry.inert = group !== category || i !== index;
			if (entry.inert) {
				const player = entry.querySelector("iframe");
				if (player) {
					player.remove();
					entry.querySelector("[data-embed]").hidden = false;
				}
			}
		});
	}
	for (const button of categories) {
		button.setAttribute("aria-pressed", String(button.dataset.category === category));
	}
	position.textContent = `${index + 1} / ${count}`;
	previous.setAttribute("aria-label", `Previous ${itemType}`);
	next.setAttribute("aria-label", `Next ${itemType}`);
	pagination.hidden = count < 2;
	if (announce) status.textContent = `${item.querySelector("h2").textContent}. ${index + 1} of ${count}.`;
}

function deckIndex(direction) {
	const count = items[category].length;
	return (indices[category] + direction + count) % count;
}

function moveDeck(direction) {
	indices[category] = deckIndex(direction);
	renderDeck(true);
}

for (const button of categories) {
	const group = button.dataset.category;
	button.disabled = items[group].length === 0;
	button.addEventListener("click", () => {
		category = group;
		renderDeck(true);
	});
}

previous.addEventListener("click", () => moveDeck(-1));
next.addEventListener("click", () => moveDeck(1));
categoryStrip.hidden = false;
renderDeck();

const slide = (offset) => `translate3d(${offset}px, 0, 0)`;

deckTrack.addEventListener("touchstart", (event) => {
	if (event.touches.length !== 1 || swipe || items[category].length < 2) return;
	const touch = event.touches[0];
	swipe = {
		id: touch.identifier,
		x: touch.clientX,
		y: touch.clientY,
		started: event.timeStamp,
		width: deckTrack.clientWidth,
		current: items[category][indices[category]],
		direction: 0,
		offset: 0,
	};
}, { passive: true });

deckTrack.addEventListener("touchmove", (event) => {
	if (!swipe || swipe.animations) return;
	if (event.touches.length !== 1) return resetSwipe();
	const touch = event.touches[0];
	if (swipe.id !== touch.identifier) return;
	const dx = touch.clientX - swipe.x;
	const dy = Math.abs(touch.clientY - swipe.y);
	if (!swipe.direction) {
		if (dy > 10 && dy >= Math.abs(dx)) return resetSwipe();
		if (Math.abs(dx) < 10 || Math.abs(dx) < dy * 1.25) return;
	}
	if (event.cancelable) event.preventDefault();

	const direction = dx <= 0 ? 1 : -1;
	if (direction !== swipe.direction) {
		if (swipe.neighbor) {
			delete swipe.neighbor.dataset.swipePreview;
			swipe.neighbor.style.transform = "";
		}
		swipe.direction = direction;
		swipe.neighbor = items[category][deckIndex(direction)];
	}
	swipe.offset = Math.max(-swipe.width, Math.min(swipe.width, dx));
	if (!reducedMotion.matches) {
		swipe.current.style.transform = slide(swipe.offset);
		swipe.neighbor.style.transform = slide(swipe.offset + direction * swipe.width);
		swipe.neighbor.dataset.swipePreview = "";
	}
}, { passive: false });

deckTrack.addEventListener("touchend", (event) => {
	const gesture = swipe;
	if (!gesture || gesture.id !== event.changedTouches[0]?.identifier || gesture.animations) return;
	const { direction, offset, width, started, current, neighbor } = gesture;
	if (!direction) return resetSwipe();
	if (event.cancelable) event.preventDefault();

	const distance = Math.abs(offset);
	const quickSwipe = distance >= 28 && distance / Math.max(1, event.timeStamp - started) >= 0.45;
	const advance = distance >= Math.min(72, width * 0.22) || quickSwipe;
	const finish = () => {
		if (swipe !== gesture) return;
		if (advance) moveDeck(direction);
		else resetSwipe();
	};
	if (reducedMotion.matches) return finish();

	const end = advance ? -direction * width : 0;
	const options = { duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" };
	gesture.animations = [
		current.animate([{ transform: slide(offset) }, { transform: slide(end) }], options),
		neighbor.animate([{ transform: slide(offset + direction * width) }, { transform: slide(end + direction * width) }], options),
	];
	gesture.animations[0].onfinish = finish;
}, { passive: false });

deckTrack.addEventListener("touchcancel", resetSwipe);

async function loadContributionGraph() {
	const heading = document.querySelector("[data-contribution-total]");
	const message = document.querySelector("[data-graph-message]");
	const scroll = document.querySelector("[data-graph-scroll]");
	const grid = document.querySelector("[data-graph-grid]");
	const year = new Date().getUTCFullYear();
	const dateLabel = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" });
	message.textContent = "Loading contributions…";
	message.hidden = false;

	try {
		const response = await fetch("/api/github");
		if (!response.ok) throw new Error("GitHub request failed");
		const data = await response.json();
		const total = data.total?.[year];
		const days = data.contributions?.filter(({ date }) => date.startsWith(`${year}-`)) ?? [];
		if (!Number.isInteger(total) || !days.length) throw new Error("Calendar unavailable");

		const cells = document.createDocumentFragment();
		const firstWeekday = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
		for (let i = 0; i < firstWeekday; i++) {
			cells.append(document.createElement("span"));
		}
		for (const day of days) {
			const cell = document.createElement("span");
			const date = new Date(`${day.date}T00:00:00Z`);
			cell.dataset.level = String(day.level);
			cell.title = `${dateLabel.format(date)}: ${day.count} ${day.count === 1 ? "contribution" : "contributions"}`;
			cells.append(cell);
		}
		const count = `${new Intl.NumberFormat("en").format(total)} ${total === 1 ? "contribution" : "contributions"}`;
		heading.textContent = count;
		grid.setAttribute("aria-label", `GitHub calendar for ${year}, ${count}`);
		grid.replaceChildren(cells);
		scroll.hidden = false;
		message.hidden = true;
	} catch {
		message.textContent = "GitHub contributions are currently unavailable.";
	}
}

loadContributionGraph();
