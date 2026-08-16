import { profile } from "@/app/data/profile";
import Link from "next/link";
import { FiTerminal, FiFileText, FiAward, FiArrowUpRight } from "react-icons/fi";

type Experience = typeof profile.experience[0];

interface MobileExperienceCardProps {
	experience: Experience;
}

export default function MobileExperienceCard({ experience }: MobileExperienceCardProps) {
	// Determine how many buttons exist to calculate grid columns
	const hasOffer = !!experience.offerLetter;
	const hasCompletion = !!experience.completionLetter;
	const buttonCount = 1 + (hasOffer ? 1 : 0) + (hasCompletion ? 1 : 0); // Always has "Details"

	return (
		<div className="w-full max-w-[22rem] mx-auto flex flex-col bg-card border-2 border-border p-4 gap-3 relative">
			{/* Card Header Equivalent */}
			<div className="flex items-center gap-2 border-b-2 border-border pb-2 shrink-0">
				<FiTerminal size={14} className="text-[var(--color-accent-warning)]" />
				<span className="font-sans text-desktop-2xs font-bold uppercase tracking-widest text-[var(--color-accent-warning)]">
					EXPERIENCE
				</span>
			</div>

			{/* Title & Subtitle */}
			<div className="flex flex-col gap-0.5 shrink-0">
				<h3 
					className="font-sans font-bold uppercase text-foreground leading-tight" 
					style={{ fontSize: "clamp(1.125rem, 0.9rem + 1vw, 1.5rem)" }}
				>
					{experience.company}
				</h3>
				<p className="text-muted-foreground font-semibold uppercase tracking-wider text-[0.625rem]">
					{experience.role}
				</p>
			</div>

			{/* Description */}
			<p className="text-desktop-xs text-foreground/80 leading-snug shrink-0 flex-1">
				{experience.description}
			</p>

			{/* Isolated Footer */}
			<div className="border-t-2 border-border mt-2 pt-3 flex gap-3 shrink-0">
				{hasOffer && (
					<a
						href={experience.offerLetter}
						target="_blank"
						rel="noreferrer"
						className="flex items-center justify-center w-10 h-10 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-foreground"
					>
						<FiFileText size={18} />
					</a>
				)}
				
				{hasCompletion && (
					<a
						href={experience.completionLetter}
						target="_blank"
						rel="noreferrer"
						className="flex items-center justify-center w-10 h-10 bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-[var(--color-accent-warning)]"
					>
						<FiAward size={18} />
					</a>
				)}

				<Link
					href="/experience"
					className="flex items-center justify-center w-10 h-10 ml-auto bg-background border-2 border-border shadow-[2px_2px_0_0_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 text-foreground"
				>
					<FiArrowUpRight size={18} />
				</Link>
			</div>
		</div>
	);
}
