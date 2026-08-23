"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ModalNavBar() {
	const router = useRouter();

	useEffect(() => {
		router.prefetch("/");
		router.prefetch("/projects");
	}, [router]);

	return (
		<nav className="sticky bottom-0 w-full py-[var(--spacing-fluid-xs-val)] bg-muted border-t-2 border-border flex items-center justify-around shrink-0 mt-auto z-10">
			<Link
				href="/projects"
				prefetch={true}
				onTouchStart={() => router.prefetch("/projects")}
				aria-label="Recent apps"
				className="min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] flex items-center justify-center cursor-pointer active:opacity-70"
			>
				<span className="font-sans font-bold text-foreground">|||</span>
			</Link>
			<Link
				href="/"
				prefetch={true}
				onTouchStart={() => router.prefetch("/")}
				aria-label="Home"
				className="min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] flex items-center justify-center cursor-pointer active:opacity-70"
			>
				<div className="w-[var(--spacing-fluid-md-val)] h-[var(--spacing-fluid-md-val)] rounded-full border-2 border-foreground" />
			</Link>
			<Link
				href="/projects"
				prefetch={true}
				onTouchStart={() => router.prefetch("/projects")}
				aria-label="Back"
				className="min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] flex items-center justify-center cursor-pointer active:opacity-70"
			>
				<span className="font-sans font-bold text-foreground text-h3 leading-none -mt-1">&lt;</span>
			</Link>
		</nav>
	);
}
