"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../ThemeProvider";

export default function MobileThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, toggle } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<button
			type="button"
			onClick={toggle}
			className="h-11 w-11 shrink-0 grid place-items-center bg-background border-[3px] border-border text-foreground shadow-xs active:translate-x-px active:translate-y-px active:shadow-none transition-transform cursor-pointer"
			aria-label="Toggle theme"
		>
			{mounted ? (
				theme === "light" ? (
					<FiMoon size={20} aria-hidden="true" />
				) : (
					<FiSun size={20} aria-hidden="true" />
				)
			) : (
				<FiMoon size={20} aria-hidden="true" className="opacity-0" />
			)}
		</button>
	);
}
