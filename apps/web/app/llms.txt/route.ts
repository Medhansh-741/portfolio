import { NextResponse } from "next/server";
import { generateLlmsIndex } from "@/app/lib/llms";

/**
 * Short, link-first index for LLM and agent consumers.
 * The complete dump lives at /llms-full.txt.
 */
export async function GET() {
	const content = generateLlmsIndex();
	return new NextResponse(content, {
		status: 200,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	});
}
