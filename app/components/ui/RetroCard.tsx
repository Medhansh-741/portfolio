"use client";

import { motion } from "framer-motion";

interface RetroCardProps {
  accentColor: string;
  padding?: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function RetroCard({
  accentColor,
  padding = "p-4",
  delay = 0.5,
  className = "",
  style,
  children,
}: RetroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay }}
      style={{
        ...style,
        // @ts-ignore — CSS custom property for dynamic hover shadow
        "--card-accent": accentColor,
      } as React.CSSProperties}
      className={`w-full h-full bg-card border-[3px] border-border shadow-md hover:shadow-[3px_3px_0_0_var(--card-accent)] ${padding} flex flex-col justify-between overflow-hidden transition-all duration-200 select-none relative ${className}`}
    >
      {children}
    </motion.div>
  );
}
