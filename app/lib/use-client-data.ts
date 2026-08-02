"use client";
import { useEffect, useState } from "react";

export function useClientData<T>(url: string): {
	data: T | null;
	loading: boolean;
	error: string | null;
} {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		let active = true;
		// eslint-disable-next-line react-hooks/set-state-in-effect -- resets flag when URL changes; idempotent
		setLoading(true);
		fetch(url)
			.then((r) => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then((json: T) => {
				if (!active) {
					return;
				}
				setData(json);
				setError(null);
			})
			.catch((e: unknown) => {
				if (!active) {
					return;
				}
				setError(e instanceof Error ? e.message : "Fetch failed");
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [url]);
	return { data, loading, error };
}
