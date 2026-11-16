import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { JsonLd, getExperiencePageSchema } from "@/app/lib/jsonld";
import { profile, staticRoutes } from "@portfolio/data";

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

export default function ExperiencePage() {
	return (
		<>
			<JsonLd data={getExperiencePageSchema()} />
			<Shell page="experience">
				<h1 className="mb-4">Experience</h1>
				<div className="grid grid-cols-[minmax(0,1fr)] gap-[0.875rem]">
					{profile.experience.map(({ company, role, period, summary, offerLetter, completionLetter }) => (
						<article
							key={company}
							className="grid grid-cols-[minmax(0,1fr)] gap-[0.65rem] border border-line p-[clamp(0.75rem,4vw,1rem)] text-[0.9375rem] [overflow-wrap:anywhere]"
						>
							<div>
								<h2>{company}</h2>
								<div role="group" aria-label="Experience documents" className="flex flex-wrap gap-x-3 *:inline-flex *:min-h-tap *:items-center *:text-[0.8125rem] *:whitespace-nowrap">
									<a href={offerLetter} aria-label={`Offer letter for ${company} (PDF)`}>
										Offer letter
									</a>
									<a href={completionLetter} aria-label={`Completion letter for ${company} (PDF)`} className="ms-auto">
										Completion letter
									</a>
								</div>
							</div>
							<div className="grid gap-[0.2rem]">
								<p className="font-[660]">{role}</p>
								<p className="text-[0.8125rem] text-muted">{period}</p>
							</div>
							<p>{summary}</p>
						</article>
					))}
				</div>
			</Shell>
		</>
	);
}
