import type { Metadata } from "next";
import { escapeHtml, formatPullDate, icon, PortfolioPage } from "../portfolio-page";
import { getOpenSourceStats, weeklyActivity, type OpenSourceStats, type Pull } from "@/app/lib/open-source";
import { profile, staticRoutes } from "@/app/data/profile";

const route = staticRoutes.find((r) => r.path === "/open-source");
const pageTitle = `Open source — ${profile.name}`;
const pageDescription = route?.description ?? `Open-source contributions by ${profile.name} to upstream community projects.`;

export const metadata: Metadata = {
	title: pageTitle,
	description: pageDescription,
	alternates: { canonical: "/open-source" },
	openGraph: { title: pageTitle, description: pageDescription, url: "/open-source", type: "website" },
	twitter: { card: "summary", title: pageTitle, description: pageDescription },
};

const STATE_LABEL: Record<Pull["state"], string> = { merged: "Merged", open: "In review", closed: "Closed" };
const n = (value: number) => value.toLocaleString("en-US");

function renderTotals(stats: OpenSourceStats) {
	const totals: [string, string][] = [
		["Merged", n(stats.merged)],
		["In review", n(stats.open)],
		["Lines merged", `+${n(stats.additions)} / −${n(stats.deletions)}`],
		["Projects", n(stats.projects.length)],
		...(stats.reviews > 0 ? [["Reviews given", n(stats.reviews)] as [string, string]] : []),
	];
	return `<dl class="oss-totals oss-totals-wide">${totals.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>`;
}

function renderPull(pull: Pull) {
	const size = `+${n(pull.additions)} −${n(pull.deletions)} · ${pull.files} file${pull.files === 1 ? "" : "s"}`;
	return `<li class="oss-pull">
		<span class="oss-state" data-state="${pull.state}">${STATE_LABEL[pull.state]}</span>
		<a href="${escapeHtml(pull.url)}">${escapeHtml(pull.title)}</a>
		<span class="oss-meta">#${pull.number} · ${formatPullDate(pull.date)} · ${size}</span>
		${pull.note ? `<p class="oss-note">${escapeHtml(pull.note)}</p>` : ""}
	</li>`;
}

function renderProjects(stats: OpenSourceStats) {
	return stats.projects
		.map((p) => {
			const counts = [p.merged && `${p.merged} merged`, p.open && `${p.open} in review`].filter(Boolean).join(" · ");
			return `<article class="detail-card">
				<div class="detail-card-heading">
					<div>
						<h3>${escapeHtml(p.project)}</h3>
						<p class="oss-meta">${escapeHtml(p.org)} · ★ ${n(p.stars)} · ${counts}</p>
					</div>
					<a class="repository-link" href="${escapeHtml(p.url)}" aria-label="${escapeHtml(p.project)} on GitHub">${icon("github")}</a>
				</div>
				<ol class="oss-pulls">${p.pulls.map(renderPull).join("")}</ol>
			</article>`;
		})
		.join("");
}

function renderActivity(stats: OpenSourceStats) {
	const weeks = weeklyActivity(stats).filter((w) => w.merged + w.opened > 0);
	const peak = Math.max(1, ...weeks.map((w) => w.merged + w.opened));
	return `<ol class="oss-weeks">${weeks
		.map(({ week, merged, opened }) => {
			const label = [merged && `${merged} merged`, opened && `${opened} in review`].filter(Boolean).join(" · ");
			return `<li>
				<span class="oss-week-label">Week of ${formatPullDate(week)}</span>
				<span class="oss-week-bar" aria-hidden="true">
					<span data-state="merged" style="width:${(merged / peak) * 100}%"></span><span data-state="open" style="width:${(opened / peak) * 100}%"></span>
				</span>
				<span class="oss-meta">${label}</span>
			</li>`;
		})
		.join("")}</ol>`;
}

export default async function OpenSourcePage() {
	const stats = await getOpenSourceStats();
	const intro = `<p class="oss-lede">Pull requests to upstream community projects. Team and hackathon repos are not counted.</p>`;
	const body =
		stats && stats.projects.length > 0
			? `${renderTotals(stats)}
				<section class="detail-section"><h2>By project</h2><div class="detail-list">${renderProjects(stats)}</div></section>
				<section class="detail-section"><h2>Activity by week</h2>${renderActivity(stats)}</section>`
			: `<p class="oss-lede">The contribution list couldn't be loaded right now. <a href="${escapeHtml(profile.github)}">See GitHub</a>.</p>`;

	return <PortfolioPage content={`<h1>Open source</h1>${intro}${body}`} />;
}
