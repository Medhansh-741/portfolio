import { getProjectSlug, type Project } from "@/app/data/profile";
import { escapeHtml, icon, renderDemo, repositoryLink } from "../portfolio-page";

export function renderProjectCard(project: Project, { lazy = false, detailed = false } = {}) {
	const title = escapeHtml(project.title);
	const slug = getProjectSlug(project.title);
	const heading = detailed ? "h1" : "h2";
	const mentions = project.mentions ?? [];
	const mentionsId = `${escapeHtml(slug)}-mentions`;
	const announcement = detailed && slug === "jansamadhan" ? mentions[0] : undefined;
	return `<article class="detail-card" id="${escapeHtml(slug)}" aria-labelledby="${escapeHtml(slug)}-title">
		<div class="detail-card-heading">
			<${heading} id="${escapeHtml(slug)}-title">${detailed ? title : `<a href="/projects/${escapeHtml(slug)}">${title}</a>`}</${heading}>
			<div class="detail-actions">
				<a class="repository-link" href="${escapeHtml(project.links.demo)}" aria-label="Watch ${title} on YouTube" title="Watch on YouTube">${icon("youtube")}</a>
				${repositoryLink(project)}
			</div>
		</div>
		${renderDemo(project, lazy ? ' loading="lazy"' : "")}
		<p>${escapeHtml(project.description)}</p>
		${announcement && project.mentionsSummary ? `<p>${escapeHtml(project.mentionsSummary)} <a class="detail-text-link" href="${escapeHtml(announcement.url)}">Manipal University Jaipur announcement</a></p>` : ""}
		${mentions.length ? `<button class="detail-text-link mentions-trigger" id="${mentionsId}" type="button" aria-haspopup="dialog" aria-controls="${mentionsId}-dialog" commandfor="${mentionsId}-dialog" command="show-modal" data-mentions-trigger><span>Mentions (${mentions.length})</span>${icon("chevron")}</button>
		<dialog class="mentions-dialog" id="${mentionsId}-dialog" aria-labelledby="${mentionsId}-title">
			<div class="mentions-content">
				<div class="mentions-heading">
					<h2 id="${mentionsId}-title">${title} mentions</h2>
					<form method="dialog"><button class="detail-text-link mentions-close" type="submit" autofocus>Close</button></form>
				</div>
				${project.mentionsSummary ? `<p>${escapeHtml(project.mentionsSummary)}</p>` : ""}
				<ul class="mentions-list">${mentions.map(({ title, url, preview }) => `
					<li><a class="mention-preview" href="${escapeHtml(url)}">
						<strong>${escapeHtml(title)}</strong>${icon("external")}
						${preview ? `<p>${escapeHtml(preview)}</p>` : ""}
					</a></li>`).join("")}</ul>
			</div>
		</dialog>` : ""}
	</article>`;
}
