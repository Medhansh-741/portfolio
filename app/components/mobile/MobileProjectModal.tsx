import { Project, profile } from "@/app/data/profile";
import { FiThumbsUp, FiThumbsDown, FiDownload } from "react-icons/fi";
import SharedVideoPreview from "../ui/SharedVideoPreview";
import ShareActionButton from "./ShareActionButton";
import Image from "next/image";
import ModalNavBar from "./ModalNavBar";
import MobileActionRow from "./MobileActionRow";
import { YouTubeEmbed } from '@next/third-parties/google';

interface MobileProjectModalProps {
	project: Project;
	allProjects: Project[];
}

function getYouTubeId(url: string | undefined) {
	if (!url) return null;
	const match = url.match(/youtu\.be\/([^?]+)/);
	return match ? match[1] : null;
}

const MOBILE_VIDEO_MAP: Record<string, string> = {
	jansamadhan: "jansamadhan",
	nyayaai: "nyayaai"
};

export default function MobileProjectModal({ project, allProjects }: MobileProjectModalProps) {
	const videoId = getYouTubeId(project.links?.demo);
	const otherProjects = allProjects.filter(p => p.title !== project.title);

	return (
		<div className="xl:hidden">
		<div className="fixed inset-0 z-[9999] flex justify-center bg-background/95 backdrop-blur-sm pointer-events-none">
			{/* Inner Modal Shell (Column Cap) */}
			<article className="w-full max-w-2xl h-full flex flex-col bg-background shadow-2xl relative pointer-events-auto overflow-y-auto overscroll-contain border-x-2 border-border [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				
				{/* 1. Video Player */}
				<figure className="w-full aspect-video bg-muted border-b-2 border-border shrink-0">
				{videoId ? (
					<YouTubeEmbed videoid={videoId} params="rel=0" />
				) : (
					<SharedVideoPreview
						projectFileName={MOBILE_VIDEO_MAP[project.title.toLowerCase()] || project.title.toLowerCase()}
						className="w-full h-full object-cover"
					/>
				)}
				</figure>

				{/* NEW 2. Dedicated Title Block */}
				<header className="p-fluid-md pb-fluid-xs shrink-0 min-w-0">
					<h1 className="font-sans font-bold uppercase text-body text-foreground break-words" style={{ overflowWrap: 'anywhere' }}>
						{project.title}
					</h1>
					{project.subtitle && (
						<p className="font-sans text-caption text-muted-foreground mt-fluid-xs">
							{project.subtitle}
						</p>
					)}
				</header>

				{/* NEW 3. Channel & Action Row */}
				<section className="flex items-center justify-between px-fluid-md pb-fluid-md border-b-2 border-border shrink-0">
					{/* Left: Profile & Subscribe */}
					<div className="flex items-center gap-fluid-sm shrink-0 min-w-0">
						<div className="w-10 h-10 rounded-full bg-foreground shrink-0" />
						<span className="font-sans font-bold capitalize text-caption text-foreground truncate">
							Medhansh
						</span>
						<a 
							href={profile.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="font-sans font-bold uppercase text-body text-[var(--color-accent-warning)] ml-fluid-xs shrink-0"
						>
							Connect
						</a>
					</div>

					{/* Right: Actions */}
					<MobileActionRow 
						url={project.links?.demo || ""} 
						projectName={project.title} 
						videoFileName={MOBILE_VIDEO_MAP[project.title.toLowerCase()] || project.title.toLowerCase()} 
					/>
				</section>

				{/* NEW 5. Other Projects List */}
				<aside className="flex flex-col gap-fluid-md pt-fluid-md pb-fluid-xl shrink-0">
					{otherProjects.map((p) => (
						<article key={p.title} className="flex flex-col min-w-0">
							{/* Large Static Thumbnail */}
							<div className="w-full aspect-video bg-muted border-y-2 border-border overflow-hidden relative">
								<Image
									src={`/videos/${MOBILE_VIDEO_MAP[p.title.toLowerCase()] || p.title.toLowerCase()}.webp`}
									alt={`${p.title} thumbnail`}
									fill
									sizes="(max-width: 768px) 100vw, 42rem"
									className="object-cover"
								/>
							</div>
							{/* Title & Desc Underneath */}
							<div className="flex gap-fluid-sm p-fluid-md pt-fluid-sm min-w-0">
								<div className="w-10 h-10 rounded-full bg-foreground shrink-0" />
								<div className="flex flex-col min-w-0">
									<h5 className="font-sans font-bold uppercase text-small text-foreground truncate">
										{p.title}
									</h5>
									<p className="font-sans text-caption text-muted-foreground truncate">
										{p.subtitle}
									</p>
								</div>
							</div>
						</article>
					))}
				</aside>

			{/* 5. Sticky Android Nav Bar */}
			<ModalNavBar />
			</article>
		</div>
		</div>
	);
}
