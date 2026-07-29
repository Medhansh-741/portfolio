import type { Metadata } from "next";
import { Inter, Playfair_Display, Pirata_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "lenis/dist/lenis.css";
import Navbar from "./components/Navbar";
import ThemeProvider from "./components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const pirataOne = Pirata_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pirata",
});

export const metadata: Metadata = {
  title: "Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer",
  description:
    "Portfolio of Medhansh Kapoor — AI/ML Engineer and Full-Stack Developer. Building production-grade AI agents, geospatial systems, and full-stack applications.",
};

import { ReactLenisProvider } from "./components/ReactLenisProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://medhanshk.me" />
        <link rel="dns-prefetch" href="https://medhanshk.me" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${pirataOne.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider>
          <ReactLenisProvider>
            <div className="min-h-dvh xl:[@media(min-height:768px)]:h-dvh xl:[@media(min-height:768px)]:max-h-dvh xl:[@media(min-height:768px)]:overflow-hidden flex flex-col">
              <Navbar />
              {children}
            </div>
          </ReactLenisProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
