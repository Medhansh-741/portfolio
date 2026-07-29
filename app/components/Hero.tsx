"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile } from "@/app/data/profile";
import MagneticWrap from "./MagneticWrap";
import ProjectsDrawer from "./ProjectsDrawer";
import ExperienceCard from "./ExperienceCard";
import HeroSection from "./HeroSection";
import AnimatedCell from "./AnimatedCell";

interface HeroProps {
  githubCalendar: React.ReactNode;
  leetCodeWidget: React.ReactNode;
  codeforcesWidget: React.ReactNode;
  commitFeed: React.ReactNode;
  githubStatsWidget: React.ReactNode;
}

export default function Hero({
  githubCalendar,
  leetCodeWidget,
  codeforcesWidget,
  commitFeed,
  githubStatsWidget,
}: HeroProps) {
  return (
    <section className="w-full px-6 md:px-12 lg:px-0 pt-3 md:pt-4 pb-6 flex-grow flex flex-col relative overflow-hidden lg:h-[calc(100dvh-155px)]">
      <div className="flex flex-col lg:flex-row justify-between items-stretch gap-8 lg:gap-12 w-full max-w-[1392px] mx-auto flex-grow h-full">
        
        {/* Left Column: Bio and Platform-Toggled Activity Graph */}
        <div className="flex-1 min-w-0 w-full max-w-2xl text-center lg:text-left flex flex-col items-center lg:items-start justify-between h-full gap-4">
          <HeroSection />

          {/* Activity calendar graph with custom platform toggles */}
          <AnimatedCell delay={0.5}>
            {githubCalendar}
          </AnimatedCell>
        </div>

        {/* Right Column: Symmetrical 2x3 Grid Deck (Columns side-by-side, widgets stretch proportionally via static CSS percentage heights) */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 justify-start items-stretch w-full lg:w-auto flex-shrink-0 h-full">
          
          {/* Column 1: Experience Stack */}
          <div className="flex flex-col justify-between w-full md:w-60 h-full">
            <ExperienceCard style={{ height: "64%" }} delay={0.5} />
            {leetCodeWidget}
          </div>

          {/* Column 2: Projects Stack */}
          <div className="flex flex-col justify-between w-full md:w-60 h-full">
            <ProjectsDrawer style={{ height: "64%" }} delay={0.6} />
            {codeforcesWidget}
          </div>

          {/* Column 3: Commit Feed Stack */}
          <div className="flex flex-col justify-between w-full md:w-60 h-full">
            {commitFeed}
            {githubStatsWidget}
          </div>
          
        </div>
      </div>
    </section>
  );
}
