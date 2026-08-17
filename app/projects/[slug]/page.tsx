import { notFound } from "next/navigation";
import { profile } from "@/app/data/profile";
import MobileProjectModal from "@/app/components/mobile/MobileProjectModal";

// This is the direct route, fallback for hard refreshes.
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
	const resolvedParams = await params;
	const project = profile.projects.find(p => p.title.toLowerCase() === resolvedParams.slug.toLowerCase());
	
	if (!project) {
		notFound();
	}

	return (
		<main className="min-h-dvh flex flex-col items-center justify-center bg-background">
			{/* Mobile Project Modal (Hidden on Desktop) */}
			<MobileProjectModal project={project} allProjects={profile.projects} />
			
			{/* Desktop Fallback (Hidden on Mobile) */}
			<div className="hidden xl:flex flex-col items-center justify-center text-center p-8 border-2 border-border bg-card">
				<h1 className="font-sans text-3xl font-black uppercase text-foreground mb-4">
					{project.title}
				</h1>
				<p className="text-muted-foreground mb-6">
					You are viewing this project directly. Return to the projects grid for the full experience.
				</p>
				<a href="/projects" className="px-6 py-3 bg-[var(--color-accent)] text-background font-bold uppercase tracking-widest border-[3px] border-border hover:-translate-y-1 transition-transform">
					Return to Projects
				</a>
			</div>
		</main>
	);
}
