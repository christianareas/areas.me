// Dependencies.
import Candidate from "@/components/Resume/Candidate"
import Download from "@/components/Resume/Download"
import Education from "@/components/Resume/Education"
import Experience from "@/components/Resume/Experience"
import SkillSets from "@/components/Resume/SkillSets"
import type { Resume as ResumeType } from "@/types/resume"

// Types.
type ResumeProps = {
	resume: ResumeType
}

// Component.
export default function Resume({ resume }: ResumeProps) {
	// Render.
	return (
		<main className="space-y-10 bg-linear-to-br from-neutral-50 via-neutral-50 to-neutral-300 p-10 font-lexend text-neutral-950 lg:p-20 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-800 dark:text-neutral-50">
			<Candidate candidate={resume.candidate} />
			<Experience experience={resume.experience} />
			<SkillSets skillSets={resume.skillSets} />
			<Education education={resume.education} />
			<Download candidate={resume.candidate} />
		</main>
	)
}
