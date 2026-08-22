"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef } from "react";

export const CardDeckContext = createContext({ isTop: true });

interface CardDeckVideoProps {
	projectFileName: string;
	className?: string;
}

export default function CardDeckVideo({ projectFileName, className = "" }: CardDeckVideoProps) {
	const { isTop } = useContext(CardDeckContext);

	if (!isTop) {
		return (
			<Image
				src={`/videos/${projectFileName}.webp`}
				alt={`${projectFileName.replace(/[-_]/g, " ")} — Production AI project video preview and poster`}
				fill
				sizes="(max-width: 640px) 100vw, 24rem"
				className={`object-cover ${className}`}
				loading="eager"
			/>
		);
	}

	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Only play when intersecting to prevent blocking initial page load
						video.play().catch((err) => {
							console.warn("Autoplay prevented by browser:", err);
						});
					} else {
						video.pause();
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(video);
		return () => observer.disconnect();
	}, []);

	return (
		<video
			ref={videoRef}
			className={`object-cover ${className}`}
			loop
			muted
			playsInline
			preload="none"
			poster={`/videos/${projectFileName}.webp`}
		>
			<source src={`/videos/${projectFileName}.webm`} type="video/webm" />
			<source src={`/videos/${projectFileName}.mp4`} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
}
