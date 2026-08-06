"use client";

import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import MagneticWrap from "@/app/components/MagneticWrap";
import { profile } from "@/app/data/profile";

const stagger = {
	hidden: { opacity: 0, y: 24 },
	show: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			type: "spring" as const,
			stiffness: 120,
			damping: 14,
			delay: i * 0.18,
		},
	}),
};

export default function ExperiencePage() {
	return (
		<main className="flex-1 bg-background overflow-x-clip">
			<div className="w-full max-w-2xl mx-auto px-6 py-16 border-x-[3px] border-border grow flex flex-col">
				<div className="text-center space-y-2 mb-12">
					<p className="text-xs text-accent font-bold uppercase tracking-widest">
						Where I&apos;ve Worked
					</p>
					<h1 className="font-sans text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight">
						Experience
					</h1>
				</div>

				<div className="space-y-8">
					{profile.experience.map((exp, i) => (
						<motion.div
							key={exp.company}
							variants={stagger}
							initial="hidden"
							animate="show"
							custom={i}
							whileHover={{ y: -3 }}
							className="bg-card text-card-foreground border-[3px] border-border shadow-md p-6 md:p-8 cursor-default"
						>
							<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
								<div>
									<h2 className="font-sans text-xl font-bold text-foreground uppercase">
										{exp.company}
									</h2>
									<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
										{exp.role}
									</p>
								</div>
								<div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
									<span>{exp.period}</span>
									<MagneticWrap>
										<a
											href={exp.offerLetter}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-accent-secondary hover:text-foreground transition-colors"
										>
											Offer Letter <FiExternalLink size={12} />
										</a>
									</MagneticWrap>
								</div>
							</div>

							<p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">
								{exp.description}
							</p>

							<div className="flex flex-wrap gap-2 mb-4">
								{exp.tech.map((t) => (
									<span
										key={t}
										className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border-[2px] border-border"
									>
										{t}
									</span>
								))}
							</div>

							<ul className="space-y-2">
								{exp.highlights.map((h, j) => (
									<li
										key={j}
										className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-[3px] border-border"
									>
										{h}
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>
			</div>
		</main>
	);
}
