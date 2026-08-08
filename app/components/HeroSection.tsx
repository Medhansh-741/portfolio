"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile } from "@/app/data/profile";
import MagneticWrap from "./MagneticWrap";

export default function HeroSection() {
	return (
		<div className="flex flex-col items-center lg:items-start w-full">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				className="inline-flex items-center gap-2 bg-accent-warning text-black px-3 py-1.5 xl:px-[clamp(0.5rem,1.5cqi,0.75rem)] xl:py-[clamp(0.25rem,1cqi,0.375rem)] text-[10px] xl:text-[clamp(0.5rem,1.2cqi,0.625rem)] font-bold uppercase tracking-widest border-[2px] border-border shadow-sm mb-4 xl:mb-[clamp(0.5rem,2cqi,1rem)]"
			>
				<span className="w-1.5 h-1.5 bg-black animate-pulse" />
				Open to Internships & Full-Time Roles
			</motion.div>

			<motion.h1
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="font-gothic text-5xl md:text-7xl xl:text-[clamp(3rem,8cqi,4.5rem)] font-normal tracking-wide text-black dark:text-white leading-[0.9] cursor-default select-none"
			>
				{"Medhansh".split("").map((char, index) => (
					<span
						key={index}
						className="transition-all duration-300 hover:[text-shadow:0_0_15px_rgba(220,38,38,0.55)] dark:hover:[text-shadow:0_0_15px_rgba(0,255,65,0.75)]"
					>
						{char}
					</span>
				))}
			</motion.h1>

			<motion.p
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="text-base xl:text-[clamp(0.7rem,1.8cqi,1rem)] font-bold tracking-widest text-muted-foreground uppercase mt-3 xl:mt-[clamp(0.25rem,1.5cqi,0.75rem)]"
			>
				{profile.tagline}
			</motion.p>

			<motion.p
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="text-sm xl:text-[clamp(0.7rem,1.8cqi,0.875rem)] text-muted-foreground leading-relaxed mt-3 xl:mt-[clamp(0.25rem,1.5cqi,0.75rem)] text-justify w-full max-w-prose"
			>
				I build by jumping in headfirst — every project is an excuse to explore
				a stack I haven&apos;t mastered yet, a problem that feels just out of
				reach, or an architecture I haven&apos;t tried. I think in systems, not
				features: connecting ideas across AI, infrastructure, and full-stack to
				build solutions that hold up under pressure. I don&apos;t stay
				comfortable. I learn by doing, I ship fast, and I believe code should
				scale beyond its first use case.
			</motion.p>

			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4 xl:mt-[clamp(0.5rem,2cqi,1rem)]"
			>
				<MagneticWrap>
					<a
						href={`mailto:${profile.email}`}
						className="px-6 py-3 xl:px-[clamp(1rem,3cqi,1.5rem)] xl:py-[clamp(0.5rem,1.5cqi,0.75rem)] text-sm xl:text-[clamp(0.7rem,1.5cqi,0.875rem)] font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--accent)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 flex items-center gap-2 select-none cursor-pointer"
					>
						<FiMail size={16} /> Contact Me
					</a>
				</MagneticWrap>
				<MagneticWrap>
					<a
						href={profile.github}
						target="_blank"
						rel="noopener noreferrer"
						className="px-6 py-3 xl:px-[clamp(1rem,3cqi,1.5rem)] xl:py-[clamp(0.5rem,1.5cqi,0.75rem)] text-sm xl:text-[clamp(0.7rem,1.5cqi,0.875rem)] font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 flex items-center gap-2 select-none cursor-pointer"
					>
						<FiGithub size={16} /> GitHub
					</a>
				</MagneticWrap>
				<MagneticWrap>
					<a
						href={profile.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						className="px-6 py-3 xl:px-[clamp(1rem,3cqi,1.5rem)] xl:py-[clamp(0.5rem,1.5cqi,0.75rem)] text-sm xl:text-[clamp(0.7rem,1.5cqi,0.875rem)] font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 flex items-center gap-2 select-none cursor-pointer"
					>
						<FiLinkedin size={16} /> LinkedIn
					</a>
				</MagneticWrap>
			</motion.div>
		</div>
	);
}
