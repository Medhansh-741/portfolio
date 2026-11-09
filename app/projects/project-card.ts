import { getProjectSlug, type Project } from "@/app/data/profile";
import { escapeHtml, icon, renderDemo, repositoryLink } from "../portfolio-page";

const descriptions: Record<string, string> = {
	nyayaai: "NyayaAI turns a legal case into research, a proposed strategy, and draft documents, with sources and explanations for its recommendations. It reads scanned files, searches Indian laws, and falls back to another model or offline rules when needed. Citizens and lawyers can discuss cases in real time, and lawyers can manage cases through a dedicated portal.",
};

export function renderProjectCard(project: Project, { lazy = false, detailed = false } = {}) {
	const title = escapeHtml(project.title);
	const slug = getProjectSlug(project.title);
	const heading = detailed ? "h1" : "h2";
	return `<article class="detail-card" id="${escapeHtml(slug)}" aria-labelledby="${escapeHtml(slug)}-title">
		<div class="detail-card-heading">
			<${heading} id="${escapeHtml(slug)}-title">${title}</${heading}>
			<div class="detail-actions">
				<a class="repository-link" href="${escapeHtml(project.links.demo)}" aria-label="Watch ${title} on YouTube" title="Watch on YouTube">${icon("youtube")}</a>
				${repositoryLink(project)}
			</div>
		</div>
		${renderDemo(project, lazy ? ' loading="lazy"' : "")}
		<p>${escapeHtml(descriptions[slug] ?? project.description)}</p>
		${detailed ? `<a class="detail-text-link" href="${escapeHtml(project.links.live)}">Open live project</a>
		<ul class="project-highlights">${project.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("")}</ul>` : ""}
	</article>`;
}
