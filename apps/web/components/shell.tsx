import Link from "next/link";
import type { ReactNode } from "react";
import { profile } from "@portfolio/data";
import { Clock } from "./clock";
import { Icon } from "./icon";

const ROUTES = [
	["home", "Home", "/"],
	["projects", "Projects", "/projects"],
	["experience", "Experience", "/experience"],
	["open-source", "Open Source", "/open-source"],
	["about", "About", "/about"],
] as const;

export type ShellPage = (typeof ROUTES)[number][0];

/**
 * Every page: masthead (name + LCD clock), the page content, and the sticky bottom bar.
 * Résumé is not in the bar; it stays at /resume (rewrite to /resume.pdf) and in the home contact row.
 */
export function Shell({ page, children }: { page?: ShellPage; children: ReactNode }) {
	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-column flex-col border-x border-line">
			<header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-gutter pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
				{page === "home" ? (
					<h1>{profile.name}</h1>
				) : (
					<Link
						href="/"
						className="text-[clamp(1.375rem,5.75vw,1.75rem)] leading-[1.15] font-[720] tracking-[-0.035em] no-underline"
					>
						{profile.name}
					</Link>
				)}
				<Clock />
			</header>
			<main className={`flex-1 px-gutter ${page === "home" ? "pb-4" : "pt-5 pb-6"}`}>{children}</main>
			<nav
				aria-label="Portfolio"
				className="sticky bottom-0 grid grid-cols-5 border-t border-line bg-paper pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]"
			>
				{ROUTES.map(([name, label, href]) => {
					const current = name === page;
					return (
						<Link
							key={name}
							href={href}
							aria-current={current ? "page" : undefined}
							className={`flex min-h-tap flex-col items-center justify-center gap-[0.2rem] border-0 bg-transparent py-[0.2rem] text-[clamp(0.625rem,2.6vw,0.75rem)] leading-[1.15] [overflow-wrap:anywhere] no-underline hover:bg-hover ${current ? "font-bold shadow-[inset_0_-2px_var(--color-ink)]" : ""}`}
						>
							<Icon name={name} className={`size-[1.15rem] ${name === "open-source" ? "text-gh-merged" : ""}`} />
							{label}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
