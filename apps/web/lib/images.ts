/**
 * Smaller copies (`<name>-480.webp`, `<name>-720.webp`, made with sharp next to the original) let each screen
 * fetch the size it shows; dense screens still get the original. Images sit inside the 30rem page column minus
 * its gutter and card padding (~3.5rem).
 */
export function responsiveImage(src: string, width: number): { srcSet?: string; sizes?: string } {
	if (width <= 720) return {};
	const copy = (w: number) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`;
	return {
		srcSet: `${copy(480)}, ${copy(720)}, ${src} ${width}w`,
		sizes: "(max-width: 30rem) calc(100vw - 3.5rem), 26.5rem",
	};
}

const pullDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** "2026-11-16" -> "Nov 16, 2026" */
export function formatPullDate(isoDate: string) {
	return pullDate.format(new Date(`${isoDate}T00:00:00Z`));
}
