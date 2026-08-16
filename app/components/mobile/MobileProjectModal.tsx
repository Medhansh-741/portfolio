import { Project, profile } from "@/app/data/profile";
import { FiThumbsUp, FiThumbsDown, FiDownload } from "react-icons/fi";
import SharedVideoPreview from "../ui/SharedVideoPreview";
import ShareActionButton from "./ShareActionButton";
import Image from "next/image";

interface MobileProjectModalProps {
	project: Project;
	allProjects: Project[];
	onClose?: () => void;
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

export default function MobileProjectModal({ project, allProjects, onClose }: MobileProjectModalProps) {
	const videoId = getYouTubeId(project.links?.demo);
	const otherProjects = allProjects.filter(p => p.title !== project.title);

	return (
		<div className="fixed inset-0 z-[9999] flex justify-center bg-background/95 backdrop-blur-sm pointer-events-none">
			{/* Inner Modal Shell (Column Cap) */}
			<div className="w-full max-w-2xl h-full flex flex-col bg-background shadow-2xl relative pointer-events-auto overflow-y-auto overscroll-contain border-x-2 border-border [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				
				{/* 1. Video Player */}
				<div className="w-full aspect-video bg-muted border-b-2 border-border shrink-0">
				{videoId ? (
					<iframe
						src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
						className="w-full h-full"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				) : (
					<SharedVideoPreview
						projectFileName={MOBILE_VIDEO_MAP[project.title.toLowerCase()] || project.title.toLowerCase()}
						className="w-full h-full object-cover"
					/>
				)}
			</div>

				{/* NEW 2. Dedicated Title Block */}
				<div className="p-fluid-md pb-fluid-xs shrink-0 min-w-0">
					<h1 className="font-sans font-bold uppercase text-h4 text-foreground break-words" style={{ overflowWrap: 'anywhere' }}>
						{project.title}
					</h1>
					{project.subtitle && (
						<p className="font-sans text-caption text-muted-foreground mt-fluid-xs">
							{project.subtitle}
						</p>
					)}
				</div>

				{/* NEW 3. Channel & Action Row */}
				<div className="flex items-center justify-between px-fluid-md pb-fluid-md border-b-2 border-border shrink-0">
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
					<div className="flex items-center gap-fluid-sm shrink-0">
						{/* Like & Dislike clustered */}
						<div className="flex items-center gap-0">
							<button className="flex items-center justify-center min-w-11 min-h-11 text-foreground">
								<FiThumbsUp size="1.25em" />
							</button>
							<button className="flex items-center justify-center min-w-11 min-h-11 text-foreground">
								<FiThumbsDown size="1.25em" />
							</button>
						</div>
						{/* Share & Download */}
						<div className="flex items-center gap-0">
							<ShareActionButton url={project.links?.demo || ""} />
							<a 
								href={`/videos/${MOBILE_VIDEO_MAP[project.title.toLowerCase()] || project.title.toLowerCase()}.mp4`} 
								download 
								className="flex items-center justify-center min-w-11 min-h-11 text-foreground"
								title="Download"
							>
								<FiDownload size="1.25em" />
							</a>
						</div>
					</div>
				</div>

				{/* NEW 5. Other Projects List */}
				<div className="flex flex-col gap-fluid-md pt-fluid-md pb-fluid-xl shrink-0">
					{otherProjects.map((p) => (
						<div key={p.title} className="flex flex-col min-w-0">
							{/* Large Static Thumbnail */}
							<div className="w-full aspect-video bg-muted border-y-2 border-border overflow-hidden relative">
								<Image
									src={`/videos/${MOBILE_VIDEO_MAP[p.title.toLowerCase()] || p.title.toLowerCase()}.webp`}
									alt={`${p.title} thumbnail`}
									fill
									className="object-cover"
								/>
							</div>
							{/* Title & Desc Underneath */}
							<div className="flex gap-fluid-sm p-fluid-md pt-fluid-sm min-w-0">
								<div className="w-10 h-10 rounded-full bg-foreground shrink-0" />
								<div className="flex flex-col min-w-0">
									<h5 className="font-sans font-bold uppercase text-h5 text-foreground truncate">
										{p.title}
									</h5>
									<p className="font-sans text-caption text-muted-foreground truncate">
										{p.subtitle}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

			{/* 5. Sticky Android Nav Bar */}
			<div className="sticky bottom-0 w-full h-12 bg-muted border-t-2 border-border flex items-center justify-around shrink-0 mt-auto z-10">
				<button className="min-w-11 min-h-11 flex items-center justify-center">
					<span className="font-sans font-bold text-foreground">|||</span>
				</button>
				<button onClick={onClose} className="min-w-11 min-h-11 flex items-center justify-center">
					<div className="w-4 h-4 rounded-full border-2 border-foreground" />
				</button>
				<button onClick={onClose} className="min-w-11 min-h-11 flex items-center justify-center">
					<span className="font-sans font-bold text-foreground text-h3 leading-none -mt-1">&lt;</span>
				</button>
			</div>
			</div>
		</div>
	);
}
