import type { ReactNode } from "react";

// 24px outline icons (1.7 stroke); the GitHub/X/play glyphs and the git-merge octicon are filled.
const ICONS = {
	home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />,
	// GitHub's git-merge octicon (24px), primer/octicons, MIT
	"open-source": (
		<g fill="currentColor" stroke="none">
			<path d="M15 13.25a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm-12.5 6a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm0-14.5a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0ZM5.75 6.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 5.75 6.5Zm0 14.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 5.75 21Zm12.5-6a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 18.25 15Z" />
			<path d="M6.5 7.25c0 2.9 2.35 5.25 5.25 5.25h4.5V14h-4.5A6.75 6.75 0 0 1 5 7.25Z" />
			<path d="M5.75 16.75A.75.75 0 0 1 5 16V8a.75.75 0 0 1 1.5 0v8a.75.75 0 0 1-.75.75Z" />
		</g>
	),
	projects: <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
	experience: (
		<>
			<rect x="3" y="7" width="18" height="13" rx="2" />
			<path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 12a20 20 0 0 0 18 0m-9 1v2" />
		</>
	),
	resume: <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zm0 0v5h5M8 12h8m-8 4h5" />,
	about: (
		<>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21v-1a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1z" />
		</>
	),
	previous: <path d="M20 12H4m6-6-6 6 6 6" />,
	next: <path d="M4 12h16m-6-6 6 6-6 6" />,
	external: <path d="M7 17 17 7M7 7h10v10" />,
	linkedin: (
		<>
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M7.5 10v6.5m0-9v.1M11 16.5V10m0 2a2.6 2.6 0 0 1 5 1v3.5" />
		</>
	),
	x: <path fill="currentColor" stroke="none" d="M17.3 3h3.1l-6.8 7.8L21.6 21h-6.2l-4.9-6.4L4.9 21H1.8l7.3-8.4L1.5 3h6.4l4.4 5.8zm-1.1 16.2h1.7L6.9 4.7H5.1z" />,
	email: (
		<>
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<path d="m4 7 8 6 8-6" />
		</>
	),
	calendar: (
		<>
			<rect x="3" y="5" width="18" height="16" rx="2" />
			<path d="M7 3v4m10-4v4M3 10h18m-12 5h6m-3-2v4" />
		</>
	),
	chevron: <path d="m6 9 6 6 6-6" />,
	github: (
		<path
			fill="currentColor"
			stroke="none"
			d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48l-.01-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.74c0 .26.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10Z"
		/>
	),
	youtube: (
		<>
			<rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
			<path fill="currentColor" stroke="none" d="m10 9 5 3-5 3z" />
		</>
	),
	play: <path fill="currentColor" stroke="none" d="M8 5v14l12-7z" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			{ICONS[name]}
		</svg>
	);
}
