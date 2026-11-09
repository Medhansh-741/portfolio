import GoogleAnalyticsDeferred from "./components/GoogleAnalyticsDeferred";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { profile } from "./data/profile";
import { JsonLd, getRootGraphSchema, SITE_URL } from "./lib/jsonld";

export const viewport: Viewport = {
	themeColor: "#FFFFFF",
	colorScheme: "light",
};

const homeTitle = `${profile.name} | ${profile.tagline.replace(" | ", " & ")}`;
const homeDescription = `Portfolio of ${profile.name}, an AI/ML engineer and full-stack developer in ${profile.location}. Explore JanSamadhan, NyayaAI, Ecoaudit, and his engineering experience.`;

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: homeTitle,
		template: `%s | ${profile.name}`,
	},
	description: homeDescription,
	authors: [{ name: profile.name, url: SITE_URL }],
	creator: profile.name,
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: homeTitle,
		description: homeDescription,
		url: SITE_URL,
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
		title: homeTitle,
		description: homeDescription,
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
