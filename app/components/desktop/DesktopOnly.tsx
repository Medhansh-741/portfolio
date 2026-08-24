"use client";

import { useMatchMedia } from "@/app/lib/use-match-media";
import DesktopGridSkeleton from "./DesktopGridSkeleton";

interface DesktopOnlyProps {
	children: React.ReactNode;
}

export default function DesktopOnly({ children }: DesktopOnlyProps) {
	const isDesktop = useMatchMedia("(min-width: 1280px)");

	// On mobile (< 1280px) or pre-hydration, skip hydrating the 8 heavy desktop widgets
	if (isDesktop !== true) {
		return <DesktopGridSkeleton />;
	}

	return <>{children}</>;
}
