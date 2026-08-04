"use client";

import { motion } from "framer-motion";
import { profile } from "@/app/data/profile";
import MobileHeroCTA from "./MobileHeroCTA";

export default function MobileHeroSection() {
	return (
		<section className="w-full flex flex-col items-start">
			{/* Open To Banner */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				className="inline-flex items-center gap-2 bg-accent-warning text-black px-3 py-1.5 text-caption font-bold uppercase tracking-widest border-[2px] border-border shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,165,0,0.5)] mb-fluid-sm"
			>
				<span className="w-1.5 h-1.5 bg-black animate-pulse" />
				Open to Internships & Full-Time Roles
			</motion.div>

			{/* Huge Name with Character Map */}
			<motion.h1
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="font-gothic text-hero font-normal tracking-wide text-black dark:text-white leading-[0.8] cursor-default select-none -ml-1"
			>
				{"Medhansh".split("").map((char, index) => (
					<span
						key={index}
						className="transition-all duration-300 hover:[text-shadow:0_0_15px_rgba(220,38,38,0.55)] dark:hover:[text-shadow:0_0_15px_rgba(0,255,65,0.75)] active:[text-shadow:0_0_15px_rgba(220,38,38,0.55)] dark:active:[text-shadow:0_0_15px_rgba(0,255,65,0.75)]"
					>
						{char}
					</span>
				))}
			</motion.h1>

			{/* Tagline */}
			<motion.p
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="text-small font-bold tracking-widest text-muted-foreground uppercase mt-3 max-w-prose leading-relaxed"
			>
				{profile.tagline}
			</motion.p>

			{/* CTA Icons */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="mt-fluid-sm"
			>
				<MobileHeroCTA />
			</motion.div>
		</section>
	);
}
