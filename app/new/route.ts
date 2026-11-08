import { getProjectSlug, profile } from "@/app/data/profile";
import { getYouTubeEmbedUrl } from "@/app/lib/youtube";

const htmlEntities: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, (character) => htmlEntities[character]);
}

const icons = {
	home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
	projects: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
	experience: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 12a20 20 0 0 0 18 0m-9 1v2"/>',
	resume: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zm0 0v5h5M8 12h8m-8 4h5"/>',
	about: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1z"/>',
	previous: '<path d="M20 12H4m6-6-6 6 6 6"/>',
	next: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
	down: '<path d="M12 4v16m-6-6 6 6 6-6"/>',
	github: '<path fill="currentColor" stroke="none" d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48l-.01-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.74c0 .26.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10Z"/>',
	play: '<path fill="currentColor" stroke="none" d="M8 5v14l12-7z"/>',
};

function icon(name: keyof typeof icons) {
	return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
}

function skillRows(groups: [string, string[]][]) {
	return groups.map(([label, skills]) => `
		<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(skills.join(", "))}</dd></div>`).join("");
}

const skillPreview = [
	["Languages", "Languages", ["Python", "TypeScript", "JavaScript", "SQL", "C", "C++"]],
	["AI / ML", "Applied AI", ["PyTorch", "LangGraph", "YOLOv8", "ONNX"]],
	["Web", "Backend / Web", ["Next.js", "React", "FastAPI", "Celery"]],
	["Data / Infra", "Data / Infra / MLOps", ["PostgreSQL", "Redis", "Docker", "AWS S3", "PostGIS"]],
] as const;

const contacts = [
	["GitHub", profile.github],
	["LinkedIn", profile.linkedin],
	["X", profile.x],
	["Email", `mailto:${profile.email}`],
	["Résumé", profile.resumeUrl],
	["Book a call", profile.cal],
];

function repositoryLink(project: (typeof profile.projects)[number]) {
	return `<a class="repository-link" href="${escapeHtml(project.links.github)}" aria-label="${escapeHtml(project.title)} repository on GitHub">${icon("github")}</a>`;
}

const projects = profile.projects.map((project, index) => {
	const title = escapeHtml(project.title);
	const embed = getYouTubeEmbedUrl(project.links.demo);
	return `<div class="deck-item" data-project${index ? " inert" : ""}>
		<div class="deck-heading">
			<h2>${title}</h2>
			${repositoryLink(project)}
		</div>
		<p class="deck-caption">${escapeHtml(project.subtitle)}</p>
		${embed ? `<div class="demo-stage">
				<a class="demo-trigger" href="${escapeHtml(project.links.demo)}" data-embed="${escapeHtml(embed)}" aria-label="Play ${title} demo">
					<img src="/videos/${escapeHtml(getProjectSlug(project.title))}.webp" alt="" width="640" height="360"${index ? ' loading="lazy"' : ""}>
					<span class="demo-play">${icon("play")}</span>
				</a>
			</div>` : ""}
	</div>`;
}).join("");

const experience = profile.experience.map((item) => `
	<div class="deck-item" data-experience inert>
		<div class="deck-heading"><h2>${escapeHtml(item.company)}</h2></div>
		<div class="experience-proof" role="group" aria-label="Experience documents">
			<a href="${escapeHtml(item.offerLetter)}">Offer letter</a>
			<a href="${escapeHtml(item.completionLetter)}">Completion letter</a>
		</div>
		<div class="experience-item">
			<p class="experience-role">${escapeHtml(item.role)}</p>
			<p class="experience-period">${escapeHtml(item.period)}</p>
			<p>${escapeHtml(item.description)}</p>
			<p class="experience-stack">${escapeHtml(item.tech.join(" · "))}</p>
		</div>
	</div>`).join("");

const bottomBar = ([
	["home", "Home"], ["projects", "Projects"], ["experience", "Experience"], ["resume", "Résumé"], ["about", "About"],
] as const).map(([name, label]) => name === "home"
	? `<span class="bottom-current" aria-current="page">${icon(name)}${label}</span>`
	: `<button type="button" disabled>${icon(name)}${label}</button>`).join("");

const document = `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<meta name="color-scheme" content="only light">
	<meta name="theme-color" content="#ffffff">
	<meta name="robots" content="noindex, follow">
	<title>${escapeHtml(profile.name)} | Portfolio</title>
	<meta name="description" content="${escapeHtml(profile.tagline)}. Selected projects and experience by ${escapeHtml(profile.name)}.">
	<link rel="icon" href="/favicon.ico">
	<link rel="stylesheet" href="/new-portfolio/styles.css">
	<script src="/new-portfolio/portfolio.js" defer></script>
</head>
<body>
	<div class="portfolio">
		<header class="masthead">
			<h1>${escapeHtml(profile.name)}</h1>
			<time class="clock" data-clock aria-label="Local time" hidden>
				<span class="clock-dial" aria-hidden="true">
					<span data-digit data-ghost="8"></span><span data-digit data-ghost="8"></span><span class="clock-colon">:</span><span data-digit data-ghost="8"></span><span data-digit data-ghost="8"></span>
				</span>
			</time>
		</header>
		<main>
			<section class="intro" aria-label="Profile">
				<p class="role">${escapeHtml(profile.tagline)}</p>
				<ul class="contact-links" aria-label="Contact and profiles">
					${contacts.map(([label, href]) => `<li><a href="${escapeHtml(href)}">${label}</a></li>`).join("")}
				</ul>
			</section>
			<section class="skills" aria-label="Technical skills">
				<dl class="skill-list">${skillRows(skillPreview.map(([label, group, picks]) => [label, picks.filter((skill) => profile.skills[group].includes(skill))]))}</dl>
				<details class="full-stack">
					<summary>Full stack ${icon("down")}</summary>
					<dl class="skill-list">${skillRows(Object.entries(profile.skills))}</dl>
				</details>
			</section>
			<section class="deck" aria-label="Selected work" data-deck>
				<div class="deck-body" id="deck-content">
					<div class="deck-pagination" data-pagination hidden>
						<button type="button" data-previous aria-label="Previous project">${icon("previous")}</button>
						<span data-position></span>
						<button type="button" data-next aria-label="Next project">${icon("next")}</button>
					</div>
					${projects}
					${experience}
				</div>
				<p class="sr-only" data-deck-status role="status"></p>
				<div class="deck-categories" role="group" aria-label="Work category" data-categories hidden>
					<button type="button" data-category="projects" aria-pressed="true" aria-controls="deck-content">Projects</button>
					<button type="button" data-category="experience" aria-pressed="false" aria-controls="deck-content">Experience</button>
				</div>
			</section>
			<section class="contributions" aria-label="GitHub contributions">
				<h2 data-contribution-total>Contributions</h2>
				<p class="graph-message" data-graph-message role="status" hidden></p>
				<div class="graph-scroll" data-graph-scroll role="region" aria-label="Contribution calendar, scroll horizontally for more dates" tabindex="0" hidden>
					<div class="graph-grid" data-graph-grid role="img"></div>
				</div>
				<noscript><a href="${escapeHtml(profile.github)}">View contributions on GitHub</a></noscript>
			</section>
		</main>
		<footer class="bottom-bar" aria-label="Portfolio bar">${bottomBar}</footer>
	</div>
</body>
</html>`;

export function GET() {
	return new Response(document, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
