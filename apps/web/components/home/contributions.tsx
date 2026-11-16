import type { ContributionGraph } from "@/app/lib/github";

const LEVEL = [
	"border border-[rgb(23_23_23/23%)] bg-[#e9e9e9]",
	"border border-[rgb(23_23_23/23%)] bg-[#a8dca7]",
	"border border-[rgb(23_23_23/23%)] bg-[#72bc76]",
	"border border-[rgb(23_23_23/23%)] bg-[#36864a]",
	"border border-[rgb(23_23_23/23%)] bg-[#216438]",
];
const dateLabel = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" });
const plural = (n: number) => (n === 1 ? "contribution" : "contributions");

/** This year's GitHub contribution calendar, rendered on the server (see getContributions). */
export function Contributions({ graph, github }: { graph: ContributionGraph | null; github: string }) {
	if (!graph) {
		return (
			<section aria-label="GitHub contributions" className="border border-line p-3">
				<h2 className="mb-[0.6rem]">Contributions</h2>
				<p className="text-[0.8125rem] text-muted">
					GitHub contributions are currently unavailable. <a href={github}>View them on GitHub</a>
				</p>
			</section>
		);
	}

	const count = `${new Intl.NumberFormat("en").format(graph.total)} ${plural(graph.total)}`;
	const blanks = new Date(`${graph.days[0].date}T00:00:00Z`).getUTCDay();

	return (
		<section aria-label="GitHub contributions" className="border border-line p-3">
			<h2 className="mb-[0.6rem]">{count}</h2>
			<div
				role="region"
				aria-label="Contribution calendar, scroll horizontally for more dates"
				tabIndex={0}
				className="overflow-x-auto overscroll-x-contain scrollbar-none"
			>
				<div
					role="img"
					aria-label={`GitHub calendar for ${graph.year}, ${count}`}
					className="grid w-max auto-cols-[var(--cell)] grid-flow-col grid-rows-[repeat(7,var(--cell))] gap-[0.16rem] [--cell:clamp(0.56rem,2.15vw,0.75rem)]"
				>
					{Array.from({ length: blanks }, (_, i) => (
						<span key={`blank-${i}`} />
					))}
					{graph.days.map((day) => (
						<span
							key={day.date}
							title={`${dateLabel.format(new Date(`${day.date}T00:00:00Z`))}: ${day.count} ${plural(day.count)}`}
							className={LEVEL[day.level]}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
