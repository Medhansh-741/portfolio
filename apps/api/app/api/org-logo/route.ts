// Same-origin proxy for GitHub org logos (see logoUrl in app/lib/open-source.ts).
// Only numeric GitHub account ids are accepted, so this can't be used to fetch arbitrary URLs.
export async function GET(request: Request) {
	const id = new URL(request.url).searchParams.get("u") ?? "";
	if (!/^\d{1,12}$/.test(id)) return new Response("Bad id", { status: 400 });

	const res = await fetch(`https://avatars.githubusercontent.com/u/${id}?s=48&v=4`, { next: { revalidate: 86400 } });
	if (!res.ok) return new Response("Not found", { status: 404 });

	return new Response(await res.arrayBuffer(), {
		headers: {
			"Content-Type": res.headers.get("content-type") ?? "image/png",
			// browsers keep it a day, Vercel's edge a week (logos rarely change)
			"Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
		},
	});
}
