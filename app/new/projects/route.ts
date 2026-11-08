import { getProjectSlug, profile } from "@/app/data/profile";
import { escapeHtml, icon, portfolioResponse, renderDemo, repositoryLink } from "../portfolio-page";

const descriptions: Record<string, string> = {
	nyayaai: "NyayaAI turns a legal case into research, a proposed strategy, and draft documents, with sources and explanations for its recommendations. It reads scanned files, searches Indian laws, and falls back to another model or offline rules when needed. Citizens and lawyers can discuss cases in real time, and lawyers can manage cases through a dedicated portal.",
};

const cards = profile.projects.map((project, index) => {
	const title = escapeHtml(project.title);
	const slug = getProjectSlug(project.title);
	return `<article class="detail-card" id="${escapeHtml(slug)}" aria-labelledby="${escapeHtml(slug)}-title">
		<div class="detail-card-heading">
			<h2 id="${escapeHtml(slug)}-title">${title}</h2>
			<div class="detail-actions">
				<a class="repository-link" href="${escapeHtml(project.links.demo)}" aria-label="Watch ${title} on YouTube" title="Watch on YouTube">${icon("youtube")}</a>
				${repositoryLink(project)}
			</div>
		</div>
		${renderDemo(project, index ? ' loading="lazy"' : "")}
		<p>${escapeHtml(descriptions[slug] ?? project.description)}</p>
	</article>`;
}).join("");

export function GET() {
	return portfolioResponse("projects", "Projects", "Projects by Medhansh Kapoor, with video demos, source code, and skills.", `<h1>Projects</h1><div class="detail-list">${cards}</div>`);
}
