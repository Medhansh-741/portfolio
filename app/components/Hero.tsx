"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile } from "@/app/data/profile";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-8">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#F4EFE6] border border-[#6A784D]/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#6A784D] shadow-sm mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-[#C4866D] animate-pulse" />
            Open to Internships & Full-Time Roles
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-[#20280B]"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold tracking-wide text-[#6A784D] uppercase mt-2"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base text-[#33432B]/80 leading-relaxed max-w-xl mt-4"
          >
            I build production-grade AI systems, geospatial intelligence platforms,
            and full-stack applications that solve real-world problems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center md:justify-start gap-3 mt-6"
          >
            <a
              href={`mailto:${profile.email}`}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#C4866D] text-[#FCF9F2] hover:bg-[#b0745b] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FiMail size={16} />
              Contact Me
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#33432B] text-[#FCF9F2] hover:bg-[#20280B] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FiGithub size={16} />
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold border-2 border-[#6A784D] text-[#20280B] hover:bg-[#F4EFE6] transition-all duration-300 flex items-center gap-2"
            >
              <FiLinkedin size={16} />
              LinkedIn
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
          className="flex-shrink-0"
        >
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-[#F4EFE6] border-2 border-[#6A784D]/20 flex items-center justify-center shadow-xl">
            <span className="font-serif text-6xl md:text-7xl font-bold text-[#6A784D]/30 select-none">
              MK
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
