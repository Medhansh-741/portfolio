import type { Metadata } from "next";
import { escapeHtml, icon, PortfolioPage } from "../portfolio-page";
import { JsonLd, getProfilePageSchema } from "@/app/lib/jsonld";
import { getProjectSlug, profile, staticRoutes } from "@/app/data/profile";

const aboutRoute = staticRoutes.find((r) => r.path === "/about");
const pageTitle = `About — ${profile.name}`;
const pageDescription =
	aboutRoute?.description ||
	`Engineering background, technical philosophy, and education of ${profile.name}.`;

export const metadata: Metadata = {
	title: "About",
	description: pageDescription,
	alternates: {
		canonical: "/about",
	},
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: "/about",
		type: "website",
		images: [
			{
				url: "/og/about.png",
				width: 1200,
				height: 630,
				alt: pageTitle,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: pageTitle,
		description: pageDescription,
		images: ["/og/about.png"],
	},
};


const achievements = profile.achievements.map(({ title, detail, certificate, eventUrl, coverage, projectTitle, images = [] }) => {
	const displayTitle = escapeHtml(title);
	const description = escapeHtml(detail ?? "");
	const mentionsProject = projectTitle
		? profile.projects.find((project) => project.title === projectTitle)
		: undefined;
	const mentions = mentionsProject && "mentions" in mentionsProject ? mentionsProject.mentions ?? [] : [];
	const mentionsSummary = mentionsProject && "mentionsSummary" in mentionsProject ? mentionsProject.mentionsSummary : undefined;
	const mentionsId = projectTitle ? `${escapeHtml(getProjectSlug(projectTitle))}-mentions` : "";
	const carousel = images.length > 1;
	const photos = images.map(({ src, alt, width, height }, index) =>
		`<img class="achievement-photo" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}"${carousel ? ' draggable="false"' : ' loading="lazy"'}${index ? ' fetchpriority="low"' : ""}>`
	).join("");
	const media = carousel ? `<div class="achievement-gallery" data-gallery>
		<div class="gallery-track" data-gallery-track tabindex="0" role="group" aria-label="${displayTitle} photos. Swipe or use the arrow keys to browse.">${photos}</div>
		<div class="gallery-dots" aria-hidden="true">${images.map((_, index) => `<span${index === 0 ? " data-current" : ""}></span>`).join("")}</div>
		<p class="sr-only" data-gallery-status role="status">Photo 1 of ${images.length}</p>
	</div>` : photos;

	return `
	<article class="detail-card">
		<h3>${displayTitle}</h3>
		${description ? `<p>${description}</p>` : ""}
		${media}
		${certificate || mentions.length ? `<div style="display:flex;flex-wrap:wrap;align-items:center;column-gap:0.75rem">
			${certificate ? `<a class="detail-text-link" href="${escapeHtml(certificate)}" aria-label="View certificate for ${displayTitle} (PDF)">View certificate</a>` : ""}
			${mentions.length ? `<button class="detail-text-link mentions-trigger" id="${mentionsId}" type="button" aria-haspopup="dialog" aria-controls="${mentionsId}-dialog" commandfor="${mentionsId}-dialog" command="show-modal" data-mentions-trigger style="margin-inline-start:auto"><span>Mentions (${mentions.length})</span>${icon("chevron")}</button>` : ""}
		</div>` : ""}
		${mentions.length ? `<dialog class="mentions-dialog" id="${mentionsId}-dialog" aria-labelledby="${mentionsId}-title">
			<div class="mentions-content">
				<div class="mentions-heading">
					<h2 id="${mentionsId}-title">${escapeHtml(mentionsProject?.title ?? title)} mentions</h2>
					<form method="dialog"><button class="detail-text-link mentions-close" type="submit" autofocus>Close</button></form>
				</div>
				${mentionsSummary ? `<p>${escapeHtml(mentionsSummary)}</p>` : ""}
				<ul class="mentions-list">${mentions.map(({ title: mentionTitle, url, preview }) => `
					<li><a class="mention-preview" href="${escapeHtml(url)}">
						<strong>${escapeHtml(mentionTitle)}</strong>${icon("external")}
						${preview ? `<p>${escapeHtml(preview)}</p>` : ""}
					</a></li>`).join("")}</ul>
			</div>
		</dialog>` : ""}
		${eventUrl || coverage ? `<div style="display:flex;flex-wrap:wrap;column-gap:0.75rem">
			${eventUrl ? `<a class="detail-text-link" href="${escapeHtml(eventUrl)}">View event</a>` : ""}
			${coverage ? `<a class="detail-text-link" style="margin-inline-start:auto;text-align:end" href="${escapeHtml(coverage.url)}">${escapeHtml(coverage.label)}</a>` : ""}
		</div>` : ""}
	</article>`;
}).join("");

const education = profile.education.map(({ institution, degree, period }) => `
	<article class="detail-card">
		<h3>${escapeHtml(institution)}</h3>
		<div class="detail-meta">
			<p>${escapeHtml(degree)}</p>
			<p class="experience-period">${escapeHtml(period)}</p>
		</div>
	</article>`).join("");

const content = `
	<h1>About</h1>
	<div class="detail-card"><p>I’m Medhansh Kapoor, an AI/ML engineer and Full-Stack Developer studying Computer Science and Engineering at Manipal University Jaipur.</p></div>
	<section class="detail-section" aria-labelledby="achievements">
		<h2 id="achievements">Achievements</h2>
		<div class="detail-list">${achievements}</div>
	</section>
	<section class="detail-section" aria-labelledby="education">
		<h2 id="education">Education</h2>
		<div class="detail-list">${education}</div>
	</section>`;

export default function AboutPage() {
	return (
		<>
			<JsonLd
				data={getProfilePageSchema(
					"/about",
					"About — Medhansh Kapoor",
					pageDescription
				)}
			/>
			<PortfolioPage page="about" content={content} />
		</>
	);
}
