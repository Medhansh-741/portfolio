import type { Metadata } from "next";
import { PortfolioPage } from "../portfolio-page";
import { renderProjectCard } from "./project-card";
import { JsonLd, getProjectsCollectionSchema } from "@/app/lib/jsonld";
import { profile, staticRoutes } from "@/app/data/profile";

const projectsRoute = staticRoutes.find((r) => r.path === "/projects");
const pageTitle = `Projects — ${profile.name}`;
const pageDescription =
	projectsRoute?.description ||
	`Explore projects by ${profile.name}.`;

export const metadata: Metadata = {
	title: "Projects",
	description: pageDescription,
	alternates: {
		canonical: "/projects",
	},
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: "/projects",
		type: "website",
		images: [
			{
				url: "/og/projects.png",
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
		images: ["/og/projects.png"],
	},
};

const cards = profile.projects.map((project, index) => renderProjectCard(project, { lazy: index > 0 })).join("");

export default function ProjectsPage() {
	return (
		<>
			<JsonLd data={getProjectsCollectionSchema()} />
			<PortfolioPage page="projects" content={`<h1>Projects</h1><div class="detail-list">${cards}</div>`} />
		</>
	);
}
