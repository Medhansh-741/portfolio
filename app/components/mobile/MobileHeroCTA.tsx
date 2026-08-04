"use client";

import { useState } from "react";
import Link from "next/link";
import { FiInstagram, FiGithub, FiMail, FiCalendar, FiFileText } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { profile } from "@/app/data/profile";
import { AnimatePresence, motion } from "framer-motion";

export default function MobileHeroCTA() {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText("medhansh541@gmail.com");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const iconClass =
		"min-h-11 min-w-11 px-fluid-md py-fluid-sm flex items-center justify-center bg-background text-foreground border-[3px] border-border shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 cursor-pointer select-none";

	return (
		<div className="relative w-full">
			<div className="flex flex-wrap gap-4">
				<a
					href="https://x.com/medhansh541"
					target="_blank"
					rel="noopener noreferrer"
					className={iconClass}
					aria-label="X (Twitter)"
				>
					<FaXTwitter size={20} />
				</a>
				<a
					href="https://www.instagram.com/medhansh341/"
					target="_blank"
					rel="noopener noreferrer"
					className={iconClass}
					aria-label="Instagram"
				>
					<FiInstagram size={20} />
				</a>
				<a
					href={profile.github}
					target="_blank"
					rel="noopener noreferrer"
					className={iconClass}
					aria-label="GitHub"
				>
					<FiGithub size={20} />
				</a>
				<button
					onClick={handleCopy}
					className={iconClass}
					aria-label="Copy Email"
				>
					<FiMail size={20} />
				</button>
				<a
					href="https://cal.com/medhansh541"
					target="_blank"
					rel="noopener noreferrer"
					className={iconClass}
					aria-label="Calendar"
				>
					<FiCalendar size={20} />
				</a>
				<Link
					href="/resume"
					className={iconClass}
					aria-label="Resume"
				>
					<FiFileText size={20} />
				</Link>
			</div>

			{/* Brutalist Toast Popup */}
			<AnimatePresence>
				{copied && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-fluid-md py-fluid-sm bg-accent text-accent-foreground font-bold uppercase tracking-widest text-small border-[3px] border-border shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_rgba(0,243,166,0.3)] whitespace-nowrap min-h-11"
					>
						Copied to Clipboard!
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
