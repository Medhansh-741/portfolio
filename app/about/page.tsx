import type { Metadata } from "next";
import { escapeHtml, PortfolioPage } from "../portfolio-page";
import { JsonLd, getProfilePageSchema } from "@/app/lib/jsonld";
import { profile, staticRoutes } from "@/app/data/profile";

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


const achievements = profile.achievements.map(({ title, detail, certificate, eventUrl, images = [] }) => {
	const displayTitle = escapeHtml(title);
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
		${detail ? `<p>${escapeHtml(detail)}</p>` : ""}
		${media}
		${certificate ? `<a class="detail-text-link" href="${escapeHtml(certificate)}" aria-label="View certificate for ${displayTitle} (PDF)">View certificate</a>` : ""}
		${eventUrl ? `<a class="detail-text-link" href="${escapeHtml(eventUrl)}">View event</a>` : ""}
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
	<div class="detail-card"><p>I like taking on problems I haven’t solved before, getting something working fast, and then figuring out how to make it hold up.</p></div>
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
