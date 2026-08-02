import Link from "next/link";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
	return (
		<main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
			<div className="max-w-xl w-full bg-card text-card-foreground border-[3px] border-border shadow-xl p-8 md:p-12 flex flex-col items-center text-center">
				{/* Terminal Header Badge */}
				<div className="inline-flex items-center gap-2 bg-accent-warning text-black px-3 py-1.5 text-[length:var(--text-fluid-xs)] font-mono font-bold uppercase tracking-widest border-[length:var(--border-fluid-sm)] border-border shadow-xs mb-6">
					<FiAlertTriangle className="w-[1.2em] h-[1.2em]" />
					STATUS: 404_ROUTE_UNMAPPED
				</div>

				<h1 className="font-gothic text-[clamp(4rem,10vw,6rem)] font-normal text-accent leading-none tracking-wide select-none">
					404
				</h1>

				<h2 className="font-sans text-[length:var(--text-fluid-lg)] font-bold text-foreground uppercase tracking-tight mt-2">
					PAGE_NOT_FOUND.EXE
				</h2>

				<p className="text-sm text-muted-foreground leading-relaxed mt-4 max-w-md">
					The requested system address does not exist or has been relocated in
					the portfolio directory.
				</p>

				<div className="mt-8">
					<Link
						href="/"
						className="inline-flex items-center gap-2 px-6 py-3 text-[length:var(--text-fluid-sm)] font-mono font-bold uppercase tracking-widest bg-background text-foreground border-[length:var(--border-fluid)] border-border shadow-md hover:shadow-[3px_3px_0_0_var(--accent)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 cursor-pointer"
					>
						<FiArrowLeft className="w-[1.2em] h-[1.2em]" />
						Return to Terminal
					</Link>
				</div>
			</div>
		</main>
	);
}
