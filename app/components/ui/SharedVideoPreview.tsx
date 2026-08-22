interface SharedVideoPreviewProps {
	projectFileName: string;
	className?: string;
}

export default function SharedVideoPreview({
	projectFileName,
	className = "",
}: SharedVideoPreviewProps) {
	return (
		<video
			className={`object-cover ${className}`}
			autoPlay
			loop
			muted
			playsInline
			preload="none"
			poster={`/videos/${projectFileName}.webp`}
		>
			{/* Load tiny WebM first if browser supports it */}
			<source src={`/videos/${projectFileName}.webm`} type="video/webm" />
			{/* Fallback to heavily compressed MP4 */}
			<source src={`/videos/${projectFileName}.mp4`} type="video/mp4" />
			{/* Fallback text if both fail */}
			Your browser does not support the video tag.
		</video>
	);
}
