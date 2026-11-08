import { getProjectSlug, profile, type Project } from "@/app/data/profile";
import { getYouTubeEmbedUrl } from "@/app/lib/youtube";

const htmlEntities: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

export function escapeHtml(value: string) {
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
	linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10v6.5m0-9v.1M11 16.5V10m0 2a2.6 2.6 0 0 1 5 1v3.5"/>',
	x: '<path fill="currentColor" stroke="none" d="M17.3 3h3.1l-6.8 7.8L21.6 21h-6.2l-4.9-6.4L4.9 21H1.8l7.3-8.4L1.5 3h6.4l4.4 5.8zm-1.1 16.2h1.7L6.9 4.7H5.1z"/>',
	email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
	calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-12 5h6m-3-2v4"/>',
	chevron: '<path d="m6 9 6 6 6-6"/>',
	github: '<path fill="currentColor" stroke="none" d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48l-.01-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.74c0 .26.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10Z"/>',
	youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path fill="currentColor" stroke="none" d="m10 9 5 3-5 3z"/>',
	play: '<path fill="currentColor" stroke="none" d="M8 5v14l12-7z"/>',
};

export function icon(name: keyof typeof icons) {
	return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
}

export function repositoryLink(project: Project) {
	return `<a class="repository-link" href="${escapeHtml(project.links.github)}" aria-label="${escapeHtml(project.title)} repository on GitHub">${icon("github")}</a>`;
}

export function renderDemo(project: Project, imageAttributes = "") {
	const title = escapeHtml(project.title);
	const embed = getYouTubeEmbedUrl(project.links.demo);
	return embed ? `<div class="demo-stage">
		<a class="demo-trigger" href="${escapeHtml(project.links.demo)}" data-embed="${escapeHtml(embed)}" aria-label="Play ${title} demo">
			<img src="/videos/${escapeHtml(getProjectSlug(project.title))}.webp" alt="" width="640" height="360"${imageAttributes}>
			<span class="demo-play">${icon("play")}</span>
		</a>
	</div>` : "";
}

const routes = [
	["home", "Home", "/new"],
	["projects", "Projects", "/new/projects"],
	["experience", "Experience", "/new/experience"],
	["resume", "Résumé", profile.resumeUrl],
	["about", "About", "/new/about"],
] as const;

type Page = Exclude<(typeof routes)[number][0], "resume">;

export function portfolioResponse(page: Page, title: string, description: string, content: string) {
	const navigation = routes.map(([name, label, href]) =>
		`<a href="${escapeHtml(href)}"${name === page ? ' class="bottom-current" aria-current="page"' : ""}>${icon(name)}${label}</a>`
	).join("");
	const document = `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<meta name="color-scheme" content="only light">
	<meta name="theme-color" content="#ffffff">
	<meta name="robots" content="noindex, follow">
	<title>${escapeHtml(title)} | ${escapeHtml(profile.name)}</title>
	<meta name="description" content="${escapeHtml(description)}">
	<link rel="icon" href="/favicon.ico">
	<link rel="stylesheet" href="/new-portfolio/styles.css">
	<script src="/new-portfolio/shared.js" defer></script>
	${page === "home" ? '<script src="/new-portfolio/portfolio.js" defer></script>' : ""}
</head>
<body>
	<div class="portfolio">
		<header class="masthead">
			${page === "home" ? `<h1>${escapeHtml(profile.name)}</h1>` : `<a class="masthead-name" href="/new">${escapeHtml(profile.name)}</a>`}
			<time class="clock" data-clock aria-label="Local time" hidden>
				<span class="clock-dial" aria-hidden="true">
					<span data-digit data-ghost="8"></span><span data-digit data-ghost="8"></span><span class="clock-colon">:</span><span data-digit data-ghost="8"></span><span data-digit data-ghost="8"></span>
				</span>
			</time>
		</header>
		<main${page === "home" ? "" : ' class="detail-page"'}>${content}</main>
		<nav class="bottom-bar" aria-label="Portfolio">${navigation}</nav>
	</div>
</body>
</html>`;

	return new Response(document, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
