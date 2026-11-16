"use client";

import { useState } from "react";
import { getProjectSlug, type Project } from "@portfolio/data";
import { getYouTubeEmbedUrl } from "@/app/lib/youtube";
import { responsiveImage } from "@/lib/images";
import { Icon } from "./icon";

// Real widths of the demo thumbnails in /public/videos (their 480/720px copies sit alongside).
const THUMB_WIDTH: Record<string, number> = { ecoaudit: 960, jansamadhan: 1904, nyayaai: 1902 };

/**
 * Project demo: a thumbnail link to YouTube that swaps itself for an embedded player on a plain click.
 * Modified clicks (new tab) and very narrow stages keep the normal link behaviour.
 */
export function Demo({
	project,
	priority,
	loading,
	className = "",
}: {
	project: Project;
	priority?: "high" | "low";
	loading?: "lazy";
	className?: string;
}) {
	const [playing, setPlaying] = useState(false);
	const embed = getYouTubeEmbedUrl(project.links.demo);
	if (!embed) return null;
	const slug = getProjectSlug(project.title);
	const src = `/videos/${slug}.webp`;
	const label = `Play ${project.title} demo`;
	const fill = "absolute inset-0 block size-full border-0";

	return (
		<div className={`relative min-h-[200px] w-full aspect-video bg-ink ${className}`}>
			{playing ? (
				<iframe
					ref={(el) => el?.focus()}
					title={label}
					src={embed}
					allow="autoplay; encrypted-media; picture-in-picture"
					allowFullScreen
					className={fill}
				/>
			) : (
				<a
					href={project.links.demo}
					aria-label={label}
					className={`${fill} focus-visible:outline-offset-[-3px]`}
					onClick={(event) => {
						if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.clientWidth < 200) return;
						event.preventDefault();
						setPlaying(true);
					}}
				>
					<img
						src={src}
						{...responsiveImage(src, THUMB_WIDTH[slug] ?? 0)}
						alt=""
						width={640}
						height={360}
						fetchPriority={priority}
						loading={loading}
						className="block size-full object-contain"
					/>
					<span className="absolute top-1/2 left-1/2 grid h-9 w-13 -translate-1/2 place-items-center rounded-[0.4rem] bg-[#d71d17] text-paper">
						<Icon name="play" className="size-[1.45rem]" />
					</span>
				</a>
			)}
		</div>
	);
}
