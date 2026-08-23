import { ImageResponse } from "next/og";
import { profile } from "@/app/data/profile";

export const runtime = "edge";
export const alt = "Project Preview";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const resolvedParams = await params;
	const project = profile.projects.find(
		(p) =>
			p.title.toLowerCase() === resolvedParams.slug.toLowerCase() ||
			p.title.toLowerCase().replace(/\s+/g, "-") === resolvedParams.slug.toLowerCase(),
	);

	const title = project ? project.title : "Project";
	const subtitle = project ? project.subtitle : "AI System";
	const videoFileName = project
		? project.title.toLowerCase().replace(/\s+/g, "")
		: resolvedParams.slug.toLowerCase().replace(/\s+/g, "");

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#0d0d0d",
					padding: 32,
				}}
			>
				{/* Retro Window Container 1.91:1 */}
				<div
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						border: "3px solid #2e2e2e",
						backgroundColor: "#141414",
						overflow: "hidden",
					}}
				>
					{/* Window Titlebar */}
					<div
						style={{
							height: 48,
							backgroundColor: "#1c1c1c",
							borderBottom: "3px solid #2e2e2e",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							paddingLeft: 20,
							paddingRight: 20,
						}}
					>
						<div
							style={{
								color: "#999999",
								fontSize: 18,
								fontFamily: "monospace",
								fontWeight: "bold",
								letterSpacing: 1.5,
							}}
						>
							📁 C:/PROJECTS/{title.toUpperCase()}.EXE
						</div>
						<div style={{ display: "flex", gap: 10 }}>
							<div
								style={{
									width: 18,
									height: 18,
									backgroundColor: "#3b82f6",
									border: "2px solid #2e2e2e",
								}}
							/>
							<div
								style={{
									width: 18,
									height: 18,
									backgroundColor: "#eab308",
									border: "2px solid #2e2e2e",
								}}
							/>
							<div
								style={{
									width: 18,
									height: 18,
									backgroundColor: "#ef4444",
									border: "2px solid #2e2e2e",
								}}
							/>
						</div>
					</div>

					{/* Body with Project Poster (Untouched Asset Reference) */}
					<div
						style={{
							flex: 1,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#000000",
							overflow: "hidden",
							position: "relative",
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={`https://medhanshk.me/videos/${videoFileName}.webp`}
							alt={title}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
							}}
						/>
					</div>

					{/* Footer Bar */}
					<div
						style={{
							height: 56,
							backgroundColor: "#141414",
							borderTop: "3px solid #2e2e2e",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							paddingLeft: 24,
							paddingRight: 24,
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
							<div
								style={{
									color: "#ffffff",
									fontSize: 20,
									fontWeight: 900,
									textTransform: "uppercase",
									letterSpacing: 1,
								}}
							>
								{title}
							</div>
							<div
								style={{
									color: "#888888",
									fontSize: 14,
									textTransform: "uppercase",
									fontWeight: 700,
									letterSpacing: 0.5,
								}}
							>
								• {subtitle}
							</div>
						</div>
						<div
							style={{
								color: "#ef4444",
								fontSize: 15,
								fontWeight: 900,
								letterSpacing: 1,
								fontFamily: "monospace",
							}}
						>
							MEDHANSHK.ME
						</div>
					</div>
				</div>
			</div>
		),
		{
			...size,
		},
	);
}
