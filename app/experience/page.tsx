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
				url: "/og/experience.png",
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
		images: ["/og/experience.png"],
	},
};


const descriptions: Record<string, string> = {
	"IndiaAI Mission (MeitY)": "Built a toolkit for ICMR to upload health research datasets securely and check data quality and privacy across 15 areas. It scores which datasets can be shared openly or need restrictions, generates reports, and sends verified dataset details to AIKosh automatically.",
	"ISSA – DRDO": "Built an offline mapping platform that automatically imports map files and satellite imagery and makes them available as interactive maps in a browser. Deployed it on a secure local network so teams could use it without internet access or manually set up map layers.",
	"Geminid Systems": "Built Salesforce integrations and tested AI prompts on CRM data. Compared how accurately AI tools turn questions into SQL across multiple tables, and wrote scripts and benchmark reports to evaluate Python audio libraries for voice analytics.",
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
		<p>${escapeHtml(descriptions[item.company] ?? item.description)}</p>
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
