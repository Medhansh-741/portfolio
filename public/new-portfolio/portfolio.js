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

const deck = document.querySelector("[data-deck]");
const categories = [...deck.querySelectorAll("[data-category]")];
const items = {
	projects: [...deck.querySelectorAll("[data-project]")],
	experience: [...deck.querySelectorAll("[data-experience]")],
};
const position = deck.querySelector("[data-position]");
const previous = deck.querySelector("[data-previous]");
const next = deck.querySelector("[data-next]");
const pagination = deck.querySelector("[data-pagination]");
const status = deck.querySelector("[data-deck-status]");
const indices = { projects: 0, experience: 0 };
let category = "projects";

function renderDeck(announce = false) {
	const index = indices[category];
	const count = items[category].length;
	const item = items[category][index];
	const itemType = category === "projects" ? "project" : "experience entry";

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

function moveDeck(direction) {
	const count = items[category].length;
	indices[category] = (indices[category] + direction + count) % count;
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
deck.querySelector("[data-categories]").hidden = false;
renderDeck();

for (const trigger of deck.querySelectorAll("[data-embed]")) {
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
