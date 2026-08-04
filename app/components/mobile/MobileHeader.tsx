import Link from "next/link";
import MobileClock from "./MobileClock";
import MobileThemeToggle from "./MobileThemeToggle";

export default function MobileHeader() {
	return (
		<div className="xl:hidden">
			<header className="mx-auto w-full max-w-2xl border-x-[3px] border-b-[3px] border-border px-fluid-sm py-4 flex flex-wrap items-center justify-between gap-x-fluid-sm gap-y-fluid-xs">
				<div className="flex items-center gap-fluid-sm min-w-0">
					<MobileClock />
					<Link
						href="/"
						className="font-gothic text-fluid-xl text-foreground leading-none min-w-0 select-none active:translate-x-px active:opacity-70 transition-transform pb-1"
					>
						medhansh
					</Link>
				</div>
				<MobileThemeToggle />
			</header>
		</div>
	);
}
