import type { Metadata } from "next";
import { escapeHtml, formatPullDate, icon, lcdNumber, PortfolioPage, prIcon } from "../portfolio-page";
import { getOpenSourceStats, type OpenSourceStats, type Pull, type UpstreamProject } from "@/app/lib/open-source";
import { profile, staticRoutes } from "@/app/data/profile";

const route = staticRoutes.find((r) => r.path === "/open-source");
const pageTitle = `Open Source — ${profile.name}`;
const pageDescription = route?.description ?? `Open-source contributions by ${profile.name} to upstream community projects.`;

export const metadata: Metadata = {
	title: "Open Source", // the root layout's template appends " | <name>"
	description: pageDescription,
	alternates: { canonical: "/open-source" },
	openGraph: { title: pageTitle, description: pageDescription, url: "/open-source", type: "website" },
	twitter: { card: "summary", title: pageTitle, description: pageDescription },
};

// GitHub's own wording, octicons and Primer state colours for everything pull-request related.
const STATE_LABEL: Record<Pull["state"], string> = { merged: "Merged", open: "Open", closed: "Closed" };
const n = (value: number) => value.toLocaleString("en-US");

function renderTotals(stats: OpenSourceStats) {
	const states = [
		["merged", stats.merged],
		["open", stats.open],
		["closed", stats.closed],
	] as const;
	return `<section class="oss-panel" aria-label="Totals">
		<p class="oss-headline">${states
			.filter(([, count]) => count > 0)
			.map(([state, count]) => `<span>${prIcon(state)}${lcdNumber(count)} ${STATE_LABEL[state]}</span>`)
			.join("")}</p>
	</section>`;
}

function renderPull(pull: Pull) {
	const meta = [
		STATE_LABEL[pull.state],
		`#${pull.number}`,
		formatPullDate(pull.date),
		`+${n(pull.additions)} −${n(pull.deletions)}`,
		`${pull.files} file${pull.files === 1 ? "" : "s"}`,
	].join(" · ");
	return `<li class="oss-pull">
		${prIcon(pull.state)}
		<div>
			<a href="${escapeHtml(pull.url)}">${escapeHtml(pull.title)}</a>
			<span class="oss-meta">${meta}</span>
			${pull.note ? `<p class="oss-note">${escapeHtml(pull.note)}</p>` : ""}
		</div>
	</li>`;
}

// Each repo collapses to one row; open, its PR list scrolls inside a fixed height so the page stays short.
function renderRepo(p: UpstreamProject, open: boolean) {
	return `<details class="oss-repo"${open ? " open" : ""}>
		<summary>
			<img src="https://github.com/${escapeHtml(p.owner)}.png?size=48" alt="" width="24" height="24" loading="lazy" decoding="async">
			<span class="oss-repo-name">
				<strong>${escapeHtml(p.project)}</strong>
				<span class="oss-about">${escapeHtml(p.about)}</span>
				<span class="oss-meta">★ ${n(p.stars)}</span>
			</span>
			<span class="oss-count">${p.pulls.length}</span>
			${icon("chevron")}
		</summary>
		<div class="oss-scroll" tabindex="0" role="region" aria-label="${escapeHtml(p.project)} pull requests">
			<ol class="oss-pulls">${p.pulls.map(renderPull).join("")}</ol>
		</div>
		<a class="oss-repo-link deck-bottom" href="${escapeHtml(p.url)}" aria-label="${escapeHtml(p.project)} repository on GitHub">View on GitHub ${icon("external")}</a>
	</details>`;
}

export default async function OpenSourcePage() {
	const stats = await getOpenSourceStats();
	const intro = `<p class="oss-lede">Pull requests to upstream community projects. Team and hackathon repos are not counted.</p>`;
	const body =
		stats && stats.projects.length > 0
			? `${renderTotals(stats)}
				<section class="detail-section"><h2>Projects</h2><div class="oss-repos">${stats.projects.map((p, i) => renderRepo(p, i === 0)).join("")}</div></section>`
			: `<p class="oss-lede">The contribution list couldn't be loaded right now. <a href="${escapeHtml(profile.github)}">See GitHub</a>.</p>`;

	return <PortfolioPage page="open-source" content={`<h1>Open Source</h1>${intro}${body}`} />;
}
