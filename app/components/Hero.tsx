"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile } from "@/app/data/profile";
import MagneticWrap from "./MagneticWrap";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-5 md:pt-7 pb-2 flex-[2]">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full">
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border-[2px] border-border shadow-sm mb-2"
          >
            <span className="w-1.5 h-1.5 bg-background animate-pulse" />
            Open to Internships & Full-Time Roles
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-5xl md:text-7xl font-black tracking-tight text-foreground uppercase leading-[0.9]"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base font-bold tracking-widest text-muted-foreground uppercase mt-2"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground leading-relaxed max-w-xl mt-3"
          >
            I build production-grade AI systems, geospatial intelligence platforms,
            and full-stack applications that solve real-world problems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-5 mb-8"
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
                className="px-5 py-2.5 text-sm font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <FiGithub size={16} /> GitHub
              </a>
            </MagneticWrap>
            <MagneticWrap>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 text-sm font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <FiLinkedin size={16} /> LinkedIn
              </a>
            </MagneticWrap>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="w-36 h-36 md:w-44 md:h-44 bg-background border-[3px] border-border shadow-lg flex items-center justify-center select-none">
            <span className="font-serif text-6xl md:text-7xl font-bold text-muted-foreground">
              MK
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
