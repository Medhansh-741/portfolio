"use client";
import dynamic from "next/dynamic";
import { useMatchMedia } from "@/app/lib/use-match-media";
import DesktopGridSkeleton from "./DesktopGridSkeleton";

const DesktopGrid = dynamic(() => import("./DesktopGrid"), {
	ssr: false,
	loading: () => <DesktopGridSkeleton />,
});

export default function DesktopOnly() {
	const isDesktop = useMatchMedia("(min-width: 1280px)");
	if (isDesktop === null) return <DesktopGridSkeleton />;
	return isDesktop ? <DesktopGrid /> : null;
}
