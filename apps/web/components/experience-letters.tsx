type ExperienceLettersProps = {
	company: string;
	offerLetter: string;
	completionLetter: string;
};

const letterButton = "letter-key inline-flex min-h-tap items-center font-medium whitespace-nowrap no-underline";

export function ExperienceLetters({ company, offerLetter, completionLetter }: ExperienceLettersProps) {
	return (
		<div role="group" aria-label="Experience documents" className="flex flex-wrap gap-2 text-[0.8125rem]">
			<a href={offerLetter} aria-label={`Offer Letter for ${company} (PDF)`} className={letterButton}>
				<span>Offer Letter</span>
			</a>
			<a href={completionLetter} aria-label={`Completion Letter for ${company} (PDF)`} className={`ms-auto ${letterButton}`}>
				<span>Completion Letter</span>
			</a>
		</div>
	);
}
