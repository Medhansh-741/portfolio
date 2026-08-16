import { Project } from "@/app/data/profile";
import Link from "next/link";
import { FiFolder } from "react-icons/fi";
import SharedVideoPreview from "../ui/SharedVideoPreview";

interface MobileProjectCardProps {
	project: Project;
}

export default function MobileProjectCard({ project }: MobileProjectCardProps) {
	return (
		<div className="w-full max-w-[22rem] mx-auto flex flex-col bg-card border-2 border-border p-4 gap-3 relative">
			{/* Card Header Equivalent */}
			<div className="flex items-center gap-2 border-b-2 border-border pb-2">
				<FiFolder size={14} className="text-[var(--color-accent-secondary)]" />
				<span className="font-sans text-desktop-2xs font-bold uppercase tracking-widest text-[var(--color-accent-secondary)]">
					PROJECT
				</span>
			</div>

			{/* Title & Subtitle */}
			<div className="flex flex-col gap-0.5">
				<h3 
					className="font-sans font-bold uppercase text-foreground leading-tight" 
					style={{ fontSize: "clamp(1.125rem, 0.9rem + 1vw, 1.5rem)" }}
				>
					{project.title}
				</h3>
				<p className="text-muted-foreground font-semibold uppercase tracking-wider text-[0.625rem]">
					{project.subtitle}
				</p>
			</div>

			{/* Video Preview */}
			<div className="w-full aspect-video bg-muted border-2 border-border overflow-hidden relative mt-1">
				<SharedVideoPreview
					projectFileName={project.title.toLowerCase() === "jansamadhan" ? "jansamadhan" : "nyayaai"}
					className="w-full h-full object-cover"
				/>
			</div>

			{/* View Details Button */}
			<div className="flex justify-end pt-1">
				<Link
					href={`/projects#${project.title.toLowerCase()}`}
					className="inline-flex items-center justify-center px-3 py-2 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-[0.625rem] font-bold uppercase tracking-widest text-foreground"
				>
					View Details ↗
				</Link>
			</div>
		</div>
	);
}
