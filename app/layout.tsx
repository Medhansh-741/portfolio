import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, Pirata_One, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
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

const dseg7 = localFont({
	src: [
		{ path: "../public/fonts/DSEG7Classic-Regular.woff2", weight: "400", style: "normal" },
		{ path: "../public/fonts/DSEG7Classic-Bold.woff2", weight: "700", style: "normal" },
	],
	variable: "--font-dseg7",
	display: "block",
});

const dseg14 = localFont({
	src: [
		{ path: "../public/fonts/DSEG14Classic-Regular.woff2", weight: "400", style: "normal" },
		{ path: "../public/fonts/DSEG14Classic-Bold.woff2", weight: "700", style: "normal" },
	],
	variable: "--font-dseg14",
	display: "block",
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
				className={`${inter.variable} ${playfair.variable} ${pirataOne.variable} ${dseg7.variable} ${dseg14.variable} antialiased bg-background text-foreground font-sans`}
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
				<GoogleAnalytics gaId="G-D064XWFM94" />
			</body>
		</html>
	);
}
