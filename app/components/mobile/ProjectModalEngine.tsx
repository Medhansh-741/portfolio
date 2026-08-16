"use client";

import { useState } from "react";
import { FiYoutube } from "react-icons/fi";
import { Project } from "@/app/data/profile";
import MobileProjectModal from "./MobileProjectModal";

interface ProjectModalEngineProps {
	project: Project;
	allProjects: Project[];
}

export default function ProjectModalEngine({ project, allProjects }: ProjectModalEngineProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* The YouTube Trigger Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="flex items-center justify-center w-11 h-11 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-[var(--color-accent-warning)]"
			>
				<FiYoutube size="1.25rem" />
			</button>

			{/* The Full-Screen Modal */}
			{isOpen && (
				<MobileProjectModal
					project={project}
					allProjects={allProjects}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}
