"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile } from "@/app/data/profile";
import MagneticWrap from "./MagneticWrap";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-4 md:pt-6 pb-2 flex-1 flex flex-col w-full">
      <div className="flex justify-between items-start w-full mb-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border-[2px] border-border shadow-sm self-start"
        >
          <span className="w-1.5 h-1.5 bg-background animate-pulse" />
          Open to Internships & Full-Time Roles
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="-rotate-2 flex-shrink-0"
        >
          <div className="w-24 h-24 md:w-36 md:h-36 bg-background border-[3px] border-border shadow-lg flex items-center justify-center select-none">
            <span className="font-serif text-4xl md:text-6xl font-bold text-muted-foreground">
              MK
            </span>
          </div>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-sans text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-foreground uppercase leading-[0.85] w-full text-nowrap"
      >
        {profile.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="self-end text-right text-base font-bold tracking-widest text-muted-foreground uppercase mt-1.5"
      >
        {profile.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="self-start max-w-2xl border-[3px] border-border shadow-md p-4 md:p-5 bg-card text-card-foreground mt-5"
      >
        <p className="text-sm leading-relaxed">
          I build by jumping in headfirst — every project is an excuse to explore a stack I haven&apos;t mastered yet, a problem that feels just out of reach, or an architecture I haven&apos;t tried. I think in systems, not features: connecting ideas across AI, infrastructure, and full-stack to build solutions that hold up under pressure. I don&apos;t stay comfortable. I learn by doing, I ship fast, and I believe code should scale beyond its first use case.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="self-start flex flex-wrap items-center gap-3 mt-5"
      >
        <MagneticWrap>
          <a href={`mailto:${profile.email}`}
            className="px-5 py-2.5 text-sm font-bold uppercase tracking-widest bg-accent text-accent-foreground border-[3px] border-accent shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <FiMail size={16} /> Contact Me
          </a>
        </MagneticWrap>
        <MagneticWrap>
          <a href={profile.github} target="_blank" rel="noopener noreferrer"
            className="px-3 py-2 text-xs font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-md transition-shadow flex items-center gap-1.5"
          >
            <FiGithub size={14} /> GitHub
          </a>
        </MagneticWrap>
        <MagneticWrap>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
            className="px-3 py-2 text-xs font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-md transition-shadow flex items-center gap-1.5"
          >
            <FiLinkedin size={14} /> LinkedIn
          </a>
        </MagneticWrap>
      </motion.div>
    </section>
  );
}
