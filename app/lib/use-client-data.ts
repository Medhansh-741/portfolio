"use client";
import { useEffect, useState } from "react";

const fetchCache = new Map<string, Promise<any>>();

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
		setLoading(true);

		if (!fetchCache.has(url)) {
			const promise = fetch(url)
				.then((r) => {
					if (!r.ok) throw new Error(`HTTP ${r.status}`);
					return r.json();
				})
				.catch((e) => {
					fetchCache.delete(url); // clear cache on error so next time it retries
					throw e;
				});
			fetchCache.set(url, promise);
		}

		fetchCache.get(url)!
			.then((json: T) => {
				if (!active) return;
				setData(json);
				setError(null);
			})
			.catch((e: unknown) => {
				if (!active) return;
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
