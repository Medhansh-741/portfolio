"use client";

import Image from "next/image";
import { createContext, useContext } from "react";

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
				src={`/videos/${projectFileName}-poster.webp`}
				alt=""
				fill
				sizes="(max-width: 640px) 100vw, 24rem"
				className={`object-cover ${className}`}
			/>
		);
	}

	return (
		<video
			className={`object-cover ${className}`}
			autoPlay
			loop
			muted
			playsInline
			preload="none"
			poster={`/videos/${projectFileName}-poster.webp`}
		>
			<source src={`/videos/${projectFileName}.webm`} type="video/webm" />
			<source src={`/videos/${projectFileName}.mp4`} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
}
