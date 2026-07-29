"use client";

import { ReactLenis } from "lenis/react";

export function ReactLenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.2, wheelMultiplier: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
