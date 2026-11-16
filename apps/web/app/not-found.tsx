import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
	title: "Page not found",
	robots: { index: false, follow: true },
	alternates: null,
};

export default function NotFound() {
	return (
		<Shell>
			<h1 className="mb-4">Page not found</h1>
			<section className="grid grid-cols-[minmax(0,1fr)] gap-[0.65rem] border border-line p-[clamp(0.75rem,4vw,1rem)] text-[0.9375rem] [overflow-wrap:anywhere]">
				<p>This page is no longer available or the address may be incorrect.</p>
				<Link href="/" className="inline-flex min-h-tap items-center justify-self-start text-[0.875rem] hover:bg-hover">
					Back to home
				</Link>
			</section>
		</Shell>
	);
}
