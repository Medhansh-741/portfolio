"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Shell } from "@/components/shell";

const action = "inline-flex min-h-tap items-center border-0 bg-transparent p-0 text-[0.875rem] underline underline-offset-[0.2em] hover:bg-hover";

export function ErrorContent({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Shell>
			<h1 className="mb-4">Something went wrong</h1>
			<section className="grid grid-cols-[minmax(0,1fr)] gap-[0.65rem] border border-line p-[clamp(0.75rem,4vw,1rem)] text-[0.9375rem] [overflow-wrap:anywhere]">
				<p>This page hit an unexpected error. Try again, or head back to the home page.</p>
				<div className="flex flex-wrap gap-x-4">
					<button type="button" onClick={reset} className={action}>
						Try again
					</button>
					<Link href="/" className={action}>
						Back to home
					</Link>
				</div>
			</section>
		</Shell>
	);
}

export default ErrorContent;
