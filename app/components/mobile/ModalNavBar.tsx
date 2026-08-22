"use client";

import { useRouter } from "next/navigation";

export default function ModalNavBar() {
	const router = useRouter();

	const handleClose = () => {
		router.back();
	};

	return (
		<nav className="sticky bottom-0 w-full py-[var(--spacing-fluid-xs-val)] bg-muted border-t-2 border-border flex items-center justify-around shrink-0 mt-auto z-10">
			<button aria-label="Recent apps" className="min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] flex items-center justify-center">
				<span className="font-sans font-bold text-foreground">|||</span>
			</button>
			<button onClick={handleClose} aria-label="Home" className="min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] flex items-center justify-center">
				<div className="w-[var(--spacing-fluid-md-val)] h-[var(--spacing-fluid-md-val)] rounded-full border-2 border-foreground" />
			</button>
			<button onClick={handleClose} aria-label="Back" className="min-w-[var(--spacing-fluid-xl-val)] min-h-[var(--spacing-fluid-xl-val)] flex items-center justify-center">
				<span className="font-sans font-bold text-foreground text-h3 leading-none -mt-1">&lt;</span>
			</button>
		</nav>
	);
}
