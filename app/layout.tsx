import type { Metadata } from "next";
import { Inter, Playfair_Display, Pirata_One } from "next/font/google";
import "./globals.css";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${pirataOne.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider>
          <div className="min-h-dvh flex flex-col">
            <Navbar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
