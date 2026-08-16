import { Project } from "@/app/data/profile";
import Link from "next/link";
import { FiFolder, FiArrowUpRight, FiGithub, FiYoutube } from "react-icons/fi";
import SharedVideoPreview from "../ui/SharedVideoPreview";
import { profile } from "@/app/data/profile";
import ProjectModalEngine from "./ProjectModalEngine";
interface MobileProjectCardProps {
	project: Project;
}

const MOBILE_VIDEO_MAP: Record<string, string> = {
	jansamadhan: "jansamadhan",
	nyayaai: "nyayaai"
};

export default function MobileProjectCard({ project }: MobileProjectCardProps) {
	return (
		<div className="w-11/12 max-w-sm mx-auto flex flex-col bg-card border-2 border-border p-fluid-md gap-fluid-sm relative">
			{/* Card Header Equivalent */}
			<div className="flex items-center gap-fluid-xs border-b-2 border-border pb-fluid-xs">
				<FiFolder className="w-[1.5em] h-[1.5em] text-[var(--color-accent-secondary)]" />
				<span className="font-sans text-caption font-bold uppercase tracking-widest text-[var(--color-accent-secondary)]">
					PROJECT
				</span>
			</div>

			{/* Title & Subtitle */}
			<div className="flex flex-col gap-fluid-xs">
				<h3 className="font-sans font-bold uppercase text-foreground text-body leading-tight">
					{project.title}
				</h3>
				<p className="text-muted-foreground font-semibold uppercase tracking-wider text-caption">
					{project.subtitle}
				</p>
			</div>

			{/* Video Preview */}
			<div className="w-full aspect-video bg-muted border-2 border-border overflow-hidden relative mt-fluid-xs">
				<SharedVideoPreview
					projectFileName={MOBILE_VIDEO_MAP[project.title.toLowerCase()] || project.title.toLowerCase()}
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Isolated Footer */}
			<div className="border-t-2 border-border mt-fluid-sm pt-fluid-md flex gap-fluid-sm shrink-0">
				{project.links?.github && (
					<a
						href={project.links.github}
						target="_blank"
						rel="noreferrer"
						className="flex items-center justify-center w-11 h-11 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-foreground"
					>
						<FiGithub size="1.25rem" />
					</a>
				)}
				
				{project.links?.demo && (
					<ProjectModalEngine project={project} allProjects={profile.projects} />
				)}

				<Link
					href={`/projects#${project.title.toLowerCase()}`}
					className="flex items-center justify-center w-11 h-11 ml-auto bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-foreground"
				>
					<FiArrowUpRight size="1.25rem" />
				</Link>
			</div>

		</div>
	);
}
