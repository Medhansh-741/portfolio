import GoogleAnalyticsDeferred from "./components/GoogleAnalyticsDeferred";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { profile } from "./data/profile";
import { JsonLd, getRootGraphSchema } from "./lib/jsonld";

export const viewport: Viewport = {
	themeColor: "#FFFFFF",
	colorScheme: "light",
};

export const metadata: Metadata = {
	metadataBase: new URL("https://medhanshk.me"),
	title: {
		default: profile.name,
		template: `%s | ${profile.name}`,
	},
	description:
		`Portfolio of ${profile.name} — AI/ML Engineer and Full-Stack Developer based in ${profile.location}. Specializing in AI agents, RAG pipelines, FastAPI, and Next.js.`,
	authors: [{ name: profile.name, url: "https://medhanshk.me" }],
	creator: profile.name,
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: `${profile.name} — AI/ML Engineer & Full-Stack Developer`,
		description:
			`Portfolio of ${profile.name} — AI/ML Engineer and Full-Stack Developer based in ${profile.location}. Specializing in AI agents, RAG pipelines, FastAPI, and Next.js.`,
		url: "https://medhanshk.me",
		siteName: profile.name,
		locale: "en_US",
		type: "website",
		images: [
			{
				url: "/og/og-image.png?v=2",
				width: 1200,
				height: 630,
				alt: `${profile.name} — AI/ML Engineer & Full-Stack Developer`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		creator: "@medhansh541",
		title: `${profile.name} — AI/ML Engineer & Full-Stack Developer`,
		description:
			`Portfolio of ${profile.name} — AI/ML Engineer and Full-Stack Developer based in ${profile.location}. Specializing in AI agents, RAG pipelines, FastAPI, and Next.js.`,
		images: ["/og/og-image.png?v=2"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: [
			{ url: "/icon.svg", type: "image/svg+xml" },
			{ url: "/favicon.ico", sizes: "32x32" },
		],
		apple: [
			{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="stylesheet" href="/new-portfolio/styles.css" />
			</head>
			<body>
				<JsonLd data={getRootGraphSchema()} />
				{children}
				<Script src="/new-portfolio/shared.js" strategy="afterInteractive" />
				<Analytics />
				<GoogleAnalyticsDeferred gaId="G-D064XWFM94" />
			</body>
		</html>
	);
}
