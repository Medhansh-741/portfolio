"use client";

import { useState, useEffect, useRef } from "react";
import { FiFolder } from "react-icons/fi";
import Link from "next/link";
import { profile, type Project } from "@/app/data/profile";
import GenieModal from "./GenieModal";
import RetroCard from "./ui/RetroCard";
import CardHeader from "./ui/CardHeader";
import CardFooter from "./ui/CardFooter";
import { motion, arc } from "framer-motion";

interface VideoLoopProps {
  src: string;
  className?: string;
}

function VideoLoop({ src, className }: VideoLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force reloading the video asset source and playing cleanly on mount/update
    video.load();
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log("Video autoplay blocked or load failed:", err);
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      autoPlay
      preload="auto"
      onTimeUpdate={(e) => {
        const video = e.currentTarget;
        // Truncate loop to 8 seconds for a fast loading, lightweight preview
        if (video.currentTime >= 8) {
          video.currentTime = 0;
        }
      }}
      className={className}
    />
  );
}

interface ProjectsDrawerProps {
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export default function ProjectsDrawer({ className = "", delay = 0.6, style }: ProjectsDrawerProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  // Helper to extract YouTube ID from standard URL
  const getYoutubeId = (url: string) => {
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1];
    }
    return "";
  };

  return (
    <>
      <RetroCard
        accentColor="var(--color-accent-secondary)"
        padding="p-4 xl:p-[clamp(0.5rem,1.5vh,1rem)]"
        delay={delay}
        className={className}
        style={style}
      >
        {/* Header */}
        <CardHeader
          icon={<FiFolder size={14} />}
          accentColor="var(--color-accent-secondary)"
          title="PROJECTS CABINET"
          badge="v2.0"
          pulse
        />

        {/* Scrollable list inside */}
        <div 
          className="mt-3 overflow-y-auto no-scrollbar flex-1 min-h-0 flex flex-col gap-4 relative z-10 w-full"
        >
          {profile.projects.map((proj) => {
            const videoId = getYoutubeId(proj.links.demo || "");

            return (
              <div key={proj.title} className="flex flex-col gap-1.5 pb-3 border-b border-border/10 last:border-b-0 last:pb-0">
                {/* Title + Subtitle */}
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase text-foreground text-left">{proj.title}</h4>
                  <p className="text-[8px] text-muted-foreground font-semibold uppercase tracking-wider text-left">{proj.subtitle}</p>
                </div>

                {/* Clean Video Preview Frame */}
                {videoId && (
                  <motion.button
                    layoutId={`project-window-${proj.title}`}
                    transition={{ layout: { path: arc({ direction: "cw" }) } }}
                    onClick={() => {
                      setActiveProject(proj);
                      setIsMaximized(false);
                    }}
                    className="w-full aspect-video relative overflow-hidden bg-card border-[3px] border-border shadow-md cursor-pointer hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-200 group"
                  >
                    <VideoLoop
                      src={`/videos/${proj.title.toLowerCase() === "jansamadhan" ? "jansamadhan.mp4" : "nyayaai.mp4"}`}
                      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                    />

                    {/* Invisible pointer interceptor overlay */}
                    <div className="absolute inset-0 z-10 bg-transparent" />

                    {/* Hover expand indicator */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 z-20">
                      <span className="bg-background text-foreground border-[2px] border-border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest shadow-xs">
                        EXPAND MONITOR
                      </span>
                    </div>
                  </motion.button>
                )}

                {/* View Details link — bottom right */}
                <div className="flex justify-end">
                  <Link
                    href={`/projects#${proj.title.toLowerCase()}`}
                    className="inline-flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-[var(--color-accent-secondary)] transition-colors"
                  >
                    View Details ↗
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <CardFooter left={`items: ${profile.projects.length}`} right="SYS_READY" />
      </RetroCard>

      {/* Retro OS Lightbox Modal with Genie Warp */}
      <GenieModal
        isOpen={!!activeProject}
        triggerRect={triggerRect}
        onClose={() => {
          setActiveProject(null);
          setTriggerRect(null);
        }}
        isMaximized={isMaximized}
        setIsMaximized={setIsMaximized}
        project={activeProject}
      />
    </>
  );
}
