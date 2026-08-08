"use client";

import { FiTerminal } from "react-icons/fi";
import { profile } from "@/app/data/profile";
import CardFooter from "./ui/CardFooter";
import CardHeader from "./ui/CardHeader";
import RetroCard from "./ui/RetroCard";

interface ExperienceCardProps {
	className?: string;
	delay?: number;
	style?: React.CSSProperties;
}

export default function ExperienceCard({
	className = "",
	delay = 0.5,
	style,
}: ExperienceCardProps) {
	return (
		<RetroCard
			accentColor="var(--color-accent-warning)"
			paddingX="px-4 xl:px-desktop-sm"
			paddingTop="pt-4 xl:pt-desktop-sm"
			paddingBottom="pb-4 xl:pb-desktop-sm"
			delay={delay}
			className={className}
			style={style}
			header={
				<CardHeader
					icon={<FiTerminal size={14} />}
					accentColor="var(--color-accent-warning)"
					title="EXP TERMINAL v1.0"
					badge="ONLINE"
					pulse
				/>
			}
			footer={<CardFooter left="sys_active: true" right="DIR_SIZE: 3.4KB" />}
		>
			{/* Directory/Playground content */}
			<div className="mt-4 flex flex-col gap-3 font-mono text-desktop-xs">
				<div className="flex justify-between items-center bg-muted/50 p-2 border border-border/10 rounded-sm">
					<span className="text-muted-foreground">MODE: DIRECTORY</span>
					<button className="text-desktop-2xs font-black uppercase bg-[var(--color-accent-warning)] text-black px-2 py-0.5 border border-black hover:-translate-y-[0.5px] hover:shadow-[1px_1px_0_0_#000000] active:translate-y-0 active:shadow-none transition-all cursor-pointer">
						[🎮 PLAY]
					</button>
				</div>

				{/* Directory Listings */}
				<div className="flex flex-col gap-2.5 mt-2">
					{profile.experience.map((exp) => (
						<div
							key={exp.company}
							className="flex items-center justify-between p-2 border border-border/10 hover:border-[var(--color-accent-warning)] hover:bg-muted/30 transition-colors cursor-pointer group"
						>
							<div className="flex items-center gap-2">
								<span className="text-[var(--color-accent-warning)]">📁</span>
								<span className="font-bold uppercase text-foreground">
									{exp.company.split(" ")[0]}
								</span>
							</div>
							<span className="text-desktop-2xs text-muted-foreground uppercase group-hover:text-foreground">
								{exp.role.split(" ")[0]}
							</span>
						</div>
					))}
				</div>
			</div>

		</RetroCard>
	);
}
