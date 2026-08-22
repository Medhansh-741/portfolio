import type { Metadata } from "next";
import AboutView from "./AboutView";

export const metadata: Metadata = {
	title: "About",
	description:
		"About Medhansh Kapoor — AI/ML Engineer and Full-Stack Developer. Education at Manipal University Jaipur, national hackathon awards, and core technical skillset.",
	alternates: {
		canonical: "/about",
	},
	openGraph: {
		title: "About — Medhansh Kapoor",
		description:
			"About Medhansh Kapoor — AI/ML Engineer and Full-Stack Developer. Education at Manipal University Jaipur, national hackathon awards, and core technical skillset.",
		url: "/about",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "About — Medhansh Kapoor",
		description:
			"About Medhansh Kapoor — AI/ML Engineer and Full-Stack Developer. Education at Manipal University Jaipur, national hackathon awards, and core technical skillset.",
	},
};

export default function AboutPage() {
	return <AboutView />;
}
