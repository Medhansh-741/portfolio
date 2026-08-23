"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export const CardDeckContext = createContext({ isTop: true });

interface CardDeckVideoProps {
	projectFileName: string;
	className?: string;
}

export default function CardDeckVideo({ projectFileName, className = "" }: CardDeckVideoProps) {
	const { isTop } = useContext(CardDeckContext);
	const [isVisible, setIsVisible] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (!isTop) return;
		const video = videoRef.current;
		if (!video) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setIsVisible(true);
						video.play().catch(() => {});
					} else {
						video.pause();
					}
				}
			},
			{ threshold: 0.1 }
		);

		observer.observe(video);
		return () => observer.disconnect();
	}, [isTop]);

	if (!isTop) {
		return (
			<Image
				src={`/videos/${projectFileName}.webp`}
				alt={`${projectFileName.replace(/[-_]/g, " ")} — Production AI project video preview and poster`}
				fill
				sizes="(max-width: 640px) 100vw, 24rem"
				className={`object-cover ${className}`}
				priority={false}
			/>
		);
	}

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
			{isVisible && (
				<>
					<source src={`/videos/${projectFileName}.webm`} type="video/webm" />
					<source src={`/videos/${projectFileName}.mp4`} type="video/mp4" />
				</>
			)}
			Your browser does not support the video tag.
		</video>
	);
}
