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
	const photos = gallery.querySelectorAll("img");
	const previous = gallery.querySelector("[data-gallery-previous]");
	const next = gallery.querySelector("[data-gallery-next]");
	const status = gallery.querySelector("[data-gallery-status]");
	let current = 0;

	function showPhoto(offset) {
		photos[current].hidden = true;
		current = (current + offset + photos.length) % photos.length;
		const photo = photos[current];
		photo.hidden = false;
		status.textContent = `Photo ${current + 1} of ${photos.length}: ${photo.alt}`;
	}

	previous.addEventListener("click", () => showPhoto(-1));
	next.addEventListener("click", () => showPhoto(1));
	previous.hidden = false;
	next.hidden = false;
}
