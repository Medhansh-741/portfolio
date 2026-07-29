"use client";

import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import AnimatedCell from "./AnimatedCell";
import ProjectsDrawer from "./ProjectsDrawer";
import ExperienceCard from "./ExperienceCard";

interface GridHeroProps {
  githubCalendar: React.ReactNode;
  leetCodeWidget: React.ReactNode;
  codeforcesWidget: React.ReactNode;
  commitFeed: React.ReactNode;
  githubStatsWidget: React.ReactNode;
}

export default function GridHero({
  githubCalendar,
  leetCodeWidget,
  codeforcesWidget,
  commitFeed,
  githubStatsWidget,
}: GridHeroProps) {
  return (
    <section className="w-full px-6 md:px-12 xl:px-0 pt-3 md:pt-4 pb-6 flex-grow flex flex-col relative overflow-x-hidden overflow-y-visible xl:[@media(min-height:768px)]:overflow-hidden">
      <div className="w-full max-w-[1392px] mx-auto h-auto xl:[@media(min-height:768px)]:h-full min-h-0 flex flex-col flex-grow">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_repeat(3,240px)] xl:grid-rows-[auto_minmax(210px,1fr)] xl:[@media(min-height:768px)]:grid-rows-[minmax(auto,2fr)_minmax(210px,1fr)] gap-4 xl:gap-[clamp(0.5rem,2vh,1.5rem)] h-auto xl:[@media(min-height:768px)]:h-full flex-grow">
          
          {/* Row 1 */}
          <div className="h-full flex flex-col justify-start">
            <HeroSection />
          </div>
          <div className="h-full min-h-0 flex flex-col">
            <ExperienceCard delay={0.5} />
          </div>
          <div className="h-full min-h-0 flex flex-col">
            <ProjectsDrawer delay={0.6} />
          </div>
          <div className="h-full min-h-0 flex flex-col">
            {commitFeed}
          </div>

          {/* Row 2 */}
          <div className="h-full min-h-0 flex flex-col">
            <AnimatedCell delay={0.5} className="h-full w-full flex flex-col justify-end">
              {githubCalendar}
            </AnimatedCell>
          </div>
          <div className="h-full min-h-0 flex flex-col">
            {leetCodeWidget}
          </div>
          <div className="h-full min-h-0 flex flex-col">
            {codeforcesWidget}
          </div>
          <div className="h-full min-h-0 flex flex-col">
            {githubStatsWidget}
          </div>
          
        </div>
      </div>
    </section>
  );
}
