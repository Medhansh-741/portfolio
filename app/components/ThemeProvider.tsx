"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext({
	theme: "light" as Theme,
	toggle: () => {},
});

export function useTheme() {
	return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		const stored = localStorage.getItem("theme") as Theme | null;
		if (stored) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- reading localStorage only after mount is the SSR-safe way to hydrate theme
			setTheme(stored);
			document.documentElement.classList.toggle("dark", stored === "dark");
		}
	}, []);

	const toggle = () => {
		const next = theme === "light" ? "dark" : "light";
		setTheme(next);
		localStorage.setItem("theme", next);
		document.documentElement.classList.toggle("dark", next === "dark");
	};

	return (
		<ThemeContext.Provider value={{ theme, toggle }}>
			{children}
		</ThemeContext.Provider>
	);
}
