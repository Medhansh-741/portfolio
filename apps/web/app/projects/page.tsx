import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { ProjectCard } from "./project-card";
import { JsonLd, getProjectsCollectionSchema } from "@/app/lib/jsonld";
import { profile, staticRoutes } from "@portfolio/data";

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
				url: "/og/projects-v2.png",
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
		images: ["/og/projects-v2.png"],
	},
};

export default function ProjectsPage() {
	return (
		<>
			<JsonLd data={getProjectsCollectionSchema()} />
			<Shell page="projects">
				<h1 className="mb-4">Projects</h1>
				<div className="grid grid-cols-[minmax(0,1fr)] gap-[0.875rem]">
					{profile.projects.map((project, index) => (
						<ProjectCard key={project.title} project={project} lazyDemo={index > 0} />
					))}
				</div>
			</Shell>
		</>
	);
}
