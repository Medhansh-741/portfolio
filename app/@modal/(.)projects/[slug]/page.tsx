import { notFound } from "next/navigation";
import { profile } from "@/app/data/profile";
import MobileProjectModal from "@/app/components/mobile/MobileProjectModal";

export default async function ProjectModalIntercept({ params }: { params: Promise<{ slug: string }> }) {
	const resolvedParams = await params;
	const project = profile.projects.find(p => p.title.toLowerCase() === resolvedParams.slug.toLowerCase());
	
	if (!project) {
		notFound();
	}

	return <MobileProjectModal project={project} allProjects={profile.projects} />;
}
