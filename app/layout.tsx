import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, Pirata_One, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import MobileHeader from "./components/mobile/MobileHeader";
import MobileBottomBar from "./components/mobile/MobileBottomBar";
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
	title: "Medhansh Kapoor",
	description:
		"Portfolio of Medhansh Kapoor — AI/ML Engineer and Full-Stack Developer. Building production-grade AI agents, geospatial systems, and full-stack applications.",
};

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${playfair.variable} ${pirataOne.variable} antialiased bg-background text-foreground font-sans`}
			>
				<link rel="preconnect" href="https://medhanshk.me" />
				<link rel="dns-prefetch" href="https://medhanshk.me" />
				<ThemeProvider>
					<div className="min-h-dvh flex flex-col">
						<Navbar />
						<MobileHeader />
						{children}
						{modal}
						<MobileBottomBar />
					</div>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
