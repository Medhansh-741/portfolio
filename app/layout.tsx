import type { Metadata } from "next";
import { Inter, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer",
  description:
    "Portfolio of Medhansh Kapoor — AI/ML Engineer and Full-Stack Developer. Building production-grade AI agents, geospatial systems, and full-stack applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} ${caveat.variable} antialiased bg-[#FCF9F2] text-[#20280B] font-sans`}
      >
        <div className="bg-noise-overlay" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
