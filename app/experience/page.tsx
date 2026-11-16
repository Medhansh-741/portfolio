import type { Metadata } from "next";
import { escapeHtml, PortfolioPage } from "../portfolio-page";
import { JsonLd, getExperiencePageSchema } from "@/app/lib/jsonld";
import { profile, staticRoutes } from "@/app/data/profile";

const experienceRoute = staticRoutes.find((r) => r.path === "/experience");
const pageTitle = `Experience — ${profile.name}`;
const pageDescription =
	experienceRoute?.description ||
	`Professional AI/ML engineering experience of ${profile.name} across IndiaAI Mission, ISSA-DRDO, and Geminid Systems.`;

export const metadata: Metadata = {
	title: "Experience",
	description: pageDescription,
	alternates: {
		canonical: "/experience",
	},
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: "/experience",
		type: "website",
		images: [
			{
				url: "/og/experience-v2.png",
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
		images: ["/og/experience-v2.png"],
	},
};


const cards = profile.experience.map((item) => {
	const company = escapeHtml(item.company);
	return `<article class="detail-card">
		<div>
			<h2>${company}</h2>
			<div class="experience-proof" role="group" aria-label="Experience documents">
				<a href="${escapeHtml(item.offerLetter)}" aria-label="Offer letter for ${company} (PDF)">Offer letter</a>
				<a href="${escapeHtml(item.completionLetter)}" aria-label="Completion letter for ${company} (PDF)">Completion letter</a>
			</div>
		</div>
		<div class="detail-meta">
			<p class="experience-role">${escapeHtml(item.role)}</p>
			<p class="experience-period">${escapeHtml(item.period)}</p>
		</div>
		<p>${escapeHtml(item.summary)}</p>
	</article>`;
}).join("");

export default function ExperiencePage() {
	return (
		<>
			<JsonLd data={getExperiencePageSchema()} />
			<PortfolioPage page="experience" content={`<h1>Experience</h1><div class="detail-list">${cards}</div>`} />
		</>
	);
}
