import type { Metadata } from "next";
import { PortfolioPage } from "./portfolio-page";

export const metadata: Metadata = {
	title: "Page not found",
	robots: { index: false, follow: true },
	alternates: null,
};

export default function NotFound() {
	return <PortfolioPage content={`
		<h1>Page not found</h1>
		<section class="detail-card">
			<p>This page is no longer available or the address may be incorrect.</p>
			<a class="detail-text-link" href="/">Back to home</a>
		</section>`} />;
}
