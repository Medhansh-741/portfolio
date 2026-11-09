import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectSlug, profile } from "@/app/data/profile";
import { PortfolioPage } from "@/app/portfolio-page";
import { renderProjectCard } from "../project-card";
import { JsonLd, getSingleProjectSchema } from "@/app/lib/jsonld";

export async function generateStaticParams() {
	return profile.projects.map((project) => ({
		slug: getProjectSlug(project.title),
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const resolvedParams = await params;
	const project = profile.projects.find(
		(p) =>
			p.title.toLowerCase() === resolvedParams.slug.toLowerCase() ||
			getProjectSlug(p.title) === resolvedParams.slug.toLowerCase(),
	);

	if (!project) return { title: "Project Not Found" };

	const slug = getProjectSlug(project.title);
	const canonicalUrl = `https://medhanshk.me/projects/${slug}`;

	const fullTitle = `${project.title} | Medhansh Kapoor`;
	const ogImageUrl = `https://medhanshk.me/og/${slug}.png`;
	const [summary] = project.description.split(/(?<=\.)\s+/, 1);

	return {
		title: project.title,
		description: summary,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title: fullTitle,
			description: summary,
			url: canonicalUrl,
			siteName: "Medhansh Kapoor",
			type: "article",
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: `${project.title} Preview`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description: summary,
			creator: "@medhansh541",
			images: [ogImageUrl],
		},
	};
}

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const resolvedParams = await params;
	const project = profile.projects.find(
		(p) =>
			p.title.toLowerCase() === resolvedParams.slug.toLowerCase() ||
			getProjectSlug(p.title) === resolvedParams.slug.toLowerCase(),
	);

	if (!project) {
		notFound();
	}

	return (
		<>
			<JsonLd data={getSingleProjectSchema(project, getProjectSlug(project.title))} />
			<PortfolioPage page="projects" content={renderProjectCard(project, { detailed: true })} />
		</>
	);
}
