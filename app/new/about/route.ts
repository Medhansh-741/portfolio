import { profile } from "@/app/data/profile";
import { escapeHtml, icon, portfolioResponse } from "../portfolio-page";

const achievements = profile.achievements.map(({ title, detail, certificate, eventUrl, images = [] }) => {
	const displayTitle = escapeHtml(title);
	const carousel = images.length > 1;
	const photos = images.map(({ src, alt, width, height }, index) =>
		`<img class="achievement-photo" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}"${index ? ' hidden fetchpriority="low"' : carousel ? "" : ' loading="lazy"'}>`
	).join("");
	const media = carousel ? `<div class="achievement-gallery" role="group" aria-label="${displayTitle} photos" data-gallery>
		${photos}
		<button type="button" data-gallery-previous aria-label="Previous photo" hidden>${icon("previous")}</button>
		<button type="button" data-gallery-next aria-label="Next photo" hidden>${icon("next")}</button>
		<p class="sr-only" data-gallery-status role="status"></p>
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
	<div class="detail-card"><p>${escapeHtml(profile.about[0])}</p></div>
	<section class="detail-section" aria-labelledby="achievements">
		<h2 id="achievements">Achievements</h2>
		<div class="detail-list">${achievements}</div>
	</section>
	<section class="detail-section" aria-labelledby="education">
		<h2 id="education">Education</h2>
		<div class="detail-list">${education}</div>
	</section>`;

export function GET() {
	return portfolioResponse("about", "About", "How Medhansh Kapoor builds, his achievements, and his education.", content);
}
