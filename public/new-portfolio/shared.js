const clock = document.querySelector("[data-clock]");
const clockDigits = clock.querySelectorAll("[data-digit]");

function updateClock() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const time = `${hours}:${minutes}`;
	if (clock.dateTime === time) return;
	const digits = hours + minutes;
	clockDigits.forEach((digit, index) => { digit.textContent = digits[index]; });
	clock.dateTime = time;
	clock.setAttribute("aria-label", `Local time ${time}`);
	clock.hidden = false;
}

updateClock();
setInterval(updateClock, 1000);

const portfolio = document.querySelector(".portfolio");
const { pagePrevious, pageNext } = portfolio.dataset;
const swipeExclusions = "[data-deck], [data-gallery], [data-graph-scroll], input, textarea, select, [contenteditable]";
const edgeInset = 24;
let pageSwipe = null;

portfolio.addEventListener("touchstart", (event) => {
	pageSwipe = null;
	if (event.touches.length !== 1 || event.target.closest(swipeExclusions) || window.visualViewport?.scale > 1) return;
	const touch = event.touches[0];
	if (touch.clientX < edgeInset || touch.clientX > document.documentElement.clientWidth - edgeInset) return;
	pageSwipe = { id: touch.identifier, x: touch.clientX, y: touch.clientY };
}, { passive: true });

portfolio.addEventListener("touchmove", (event) => {
	if (!pageSwipe) return;
	const touch = event.touches[0];
	if (event.touches.length !== 1 || touch.identifier !== pageSwipe.id) {
		pageSwipe = null;
		return;
	}
	const dx = touch.clientX - pageSwipe.x;
	const dy = Math.abs(touch.clientY - pageSwipe.y);
	if (dy > 12 && dy >= Math.abs(dx)) {
		pageSwipe = null;
		return;
	}
	if (Math.abs(dx) > 12 && Math.abs(dx) > dy * 1.5 && (dx < 0 ? pageNext : pagePrevious) && event.cancelable) {
		event.preventDefault();
	}
}, { passive: false });

portfolio.addEventListener("touchend", (event) => {
	const gesture = pageSwipe;
	pageSwipe = null;
	const touch = event.changedTouches[0];
	if (!gesture || !touch || gesture.id !== touch.identifier || window.getSelection()?.isCollapsed === false) return;
	const dx = touch.clientX - gesture.x;
	const dy = Math.abs(touch.clientY - gesture.y);
	const target = dx < 0 ? pageNext : pagePrevious;
	if (!target || Math.abs(dx) < 64 || Math.abs(dx) < dy * 1.5) return;
	if (event.cancelable) event.preventDefault();
	window.location.assign(target);
}, { passive: false });

portfolio.addEventListener("touchcancel", () => { pageSwipe = null; }, { passive: true });

for (const trigger of document.querySelectorAll("[data-embed]")) {
	trigger.addEventListener("click", (event) => {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || trigger.clientWidth < 200) return;
		event.preventDefault();
		const player = document.createElement("iframe");
		player.title = trigger.getAttribute("aria-label");
		player.src = trigger.dataset.embed;
		player.allow = "autoplay; encrypted-media; picture-in-picture";
		player.allowFullscreen = true;
		trigger.after(player);
		trigger.hidden = true;
		player.focus();
	});
}

for (const gallery of document.querySelectorAll("[data-gallery]")) {
	const track = gallery.querySelector("[data-gallery-track]");
	const dots = gallery.querySelectorAll(".gallery-dots span");
	const status = gallery.querySelector("[data-gallery-status]");
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	let current = 0;
	let drag = null;

	function photoIndex() {
		return Math.min(dots.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
	}

	function goToPhoto(index) {
		track.scrollTo({ left: index * track.clientWidth, behavior: reducedMotion.matches ? "auto" : "smooth" });
	}

	track.addEventListener("scroll", () => {
		const index = photoIndex();
		if (index === current) return;
		dots[current].removeAttribute("data-current");
		dots[index].setAttribute("data-current", "");
		current = index;
		status.textContent = `Photo ${current + 1} of ${dots.length}`;
	}, { passive: true });

	track.addEventListener("keydown", (event) => {
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
		event.preventDefault();
		goToPhoto(current + (event.key === "ArrowRight" ? 1 : -1));
	});

	track.addEventListener("pointerdown", (event) => {
		if (event.pointerType !== "mouse" || event.button !== 0) return;
		drag = { x: event.clientX, left: track.scrollLeft, index: photoIndex() };
		track.setPointerCapture(event.pointerId);
		track.dataset.dragging = "";
	});

	track.addEventListener("pointermove", (event) => {
		if (!drag || event.pointerType !== "mouse") return;
		track.scrollLeft = drag.left + drag.x - event.clientX;
	});

	track.addEventListener("lostpointercapture", () => {
		if (!drag) return;
		const distance = track.scrollLeft - drag.left;
		const index = Math.abs(distance) > track.clientWidth * 0.2 ? drag.index + Math.sign(distance) : drag.index;
		drag = null;
		delete track.dataset.dragging;
		goToPhoto(index);
	});
}
