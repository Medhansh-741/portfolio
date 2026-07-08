"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

interface GenieModalProps {
  isOpen: boolean;
  triggerRect: DOMRect | null;
  onClose: () => void;
  isMaximized: boolean;
  setIsMaximized: (val: boolean) => void;
  project: any;
}

export default function GenieModal({
  isOpen,
  triggerRect,
  onClose,
  isMaximized,
  setIsMaximized,
  project,
}: GenieModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1];
    }
    return "";
  };

  // Compute pixel dimensions dynamically for smooth number-to-number transitions
  const normalWidth = Math.min(window.innerWidth - 32, 1024);
  const normalHeight = Math.min(window.innerHeight * 0.8, 680);

  const startState = {
    scale: 0.95,
    opacity: 0,
    y: 12,
    width: normalWidth,
    height: normalHeight,
  };

  const normalState = {
    scale: 1,
    opacity: 1,
    y: 0,
    width: normalWidth,
    height: normalHeight,
  };

  const maximizedState = {
    scale: 1,
    opacity: 1,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const transition = {
    ease: "easeOut",
    duration: 0.25,
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && project && triggerRect && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 flex items-center justify-center p-0 cursor-zoom-out"
        >
          <motion.div
            initial={startState as any}
            animate={isMaximized ? (maximizedState as any) : (normalState as any)}
            exit={startState as any}
            transition={transition as any}
            onClick={(e) => e.stopPropagation()}
            className={`bg-card text-card-foreground flex flex-col cursor-default relative overflow-hidden select-none transition-shadow duration-200 ${
              isMaximized 
                ? "border-0 shadow-none rounded-none" 
                : "border-[3px] border-border shadow-md rounded-none"
            }`}
          >
            {/* Title Bar */}
            <div className="h-[38px] bg-muted border-b-[3px] border-border flex items-center justify-between px-3 select-none flex-shrink-0 relative z-30">
              <span className="font-mono text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                📁 C:/PROJECTS/{project.title.toUpperCase()}.EXE
              </span>
              
              {/* Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={onClose}
                  title="Minimize"
                  className="w-6 h-6 border-[2px] border-border bg-[var(--color-accent-secondary)] flex items-center justify-center font-black text-xs text-border hover:-translate-y-[1px] hover:shadow-[1px_1px_0_0_#000000] active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                >
                  -
                </button>
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  title={isMaximized ? "Restore Window" : "Maximize"}
                  className="w-6 h-6 border-[2px] border-border bg-[var(--color-accent-warning)] flex items-center justify-center font-black text-xs text-border hover:-translate-y-[1px] hover:shadow-[1px_1px_0_0_#000000] active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                >
                  ▢
                </button>
                <button 
                  onClick={onClose}
                  title="Close"
                  className="w-6 h-6 border-[2px] border-border bg-[var(--color-accent)] flex items-center justify-center font-black text-xs text-border hover:-translate-y-[1px] hover:shadow-[1px_1px_0_0_#000000] active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Theater Video Body */}
            <div className="p-4 bg-background flex flex-col gap-4 relative z-10 flex-grow h-[calc(100%-38px)] overflow-hidden">
              {project.links.demo && (
                <div className="w-full relative bg-black shadow-md border-[3px] border-border overflow-hidden flex-grow">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(project.links.demo)}?autoplay=1&mute=0&loop=1&playlist=${getYoutubeId(project.links.demo)}`}
                    title={`${project.title} Demo Video`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Footer details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 flex-shrink-0">
                <div>
                  <h3 className="font-sans text-sm font-black uppercase text-foreground">{project.title}</h3>
                  <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">{project.subtitle}</p>
                </div>
                <Link
                  href={`/projects#${project.title.toLowerCase()}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 border-[2px] border-border bg-muted hover:bg-muted/70 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-foreground transition-all duration-200 cursor-pointer shadow-xs active:translate-x-0 active:translate-y-0 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-sm"
                >
                  Read Documentation <FiExternalLink size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
