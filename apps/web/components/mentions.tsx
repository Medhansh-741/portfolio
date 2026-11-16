"use client";

import type { Project } from "@portfolio/data";
import { Icon } from "@/components/icon";

const textLink = "inline-flex min-h-tap items-center justify-self-start text-[0.875rem] hover:bg-hover";
const underline = "underline decoration-1 underline-offset-[0.2em]";

/** Opens the dialog natively via command/commandfor; the click handler covers browsers without invoker commands. */
export function MentionsTrigger({ id, dialogId, count, className = "" }: { id: string; dialogId: string; count: number; className?: string }) {
	return (
		<button
			id={id}
			type="button"
			aria-haspopup="dialog"
			aria-controls={dialogId}
			{...{ commandfor: dialogId, command: "show-modal" }}
			onClick={(event) => {
				if (!("commandForElement" in event.currentTarget)) (document.getElementById(dialogId) as HTMLDialogElement | null)?.showModal();
			}}
			className={`${textLink} gap-[0.3rem] border-0 bg-transparent p-0 ${className}`}
		>
			<span className={underline}>{`Mentions (${count})`}</span>
			<Icon name="chevron" className="size-3 -rotate-90" />
		</button>
	);
}

/** Modal list of mentions; clicking the backdrop (the dialog box itself) closes it. */
export function MentionsDialog({ id, title, summary, mentions }: { id: string; title: string; summary?: string; mentions: NonNullable<Project["mentions"]> }) {
	return (
		<dialog
			id={`${id}-dialog`}
			aria-labelledby={`${id}-title`}
			onClick={(event) => {
				if (event.target === event.currentTarget) event.currentTarget.close();
			}}
			className="m-auto max-h-[calc(100dvh-2rem)] w-[min(calc(100%-2rem),28rem)] border border-line bg-paper p-0 text-ink overscroll-contain backdrop:bg-[rgb(0_0_0/42%)]"
		>
			<div className="p-gutter">
				<div className="flex items-center justify-between gap-3">
					<h2 id={`${id}-title`} className="text-[1.125rem] leading-[1.25]">
						{title}
					</h2>
					<form method="dialog">
						<button type="submit" autoFocus className={`${textLink} ${underline} min-w-tap justify-center border-0 bg-transparent p-0`}>
							Close
						</button>
					</form>
				</div>
				{summary && <p className="mb-[0.625rem]">{summary}</p>}
				<ul className="mx-0 mt-[0.375rem] mb-0 grid list-none gap-2 p-0">
					{mentions.map(({ title, url, preview }) => (
						<li key={url}>
							<a href={url} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-1 border border-line-soft p-3 no-underline hover:bg-hover">
								<strong>{title}</strong>
								<Icon name="external" className="size-4" />
								{preview && <p className="col-span-full text-[0.875rem]">{preview}</p>}
							</a>
						</li>
					))}
				</ul>
			</div>
		</dialog>
	);
}
