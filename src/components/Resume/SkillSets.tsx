// Dependencies.
import type { SkillSet } from "@/data/resume"
import { resume } from "@/data/resume"

// Component.
export default function SkillSets() {
	// Skill sets.
	const skillSets = (resume.skillSets ?? [])
		.map((skillSet) => ({
			...skillSet,
			skills: [...skillSet.skills].sort((a, b) => a.sortOrder - b.sortOrder),
		}))
		.sort((a, b) => a.sortOrder - b.sortOrder)

	// Skill set labels.
	const skillSetLabels: Record<SkillSet["skillSetType"], string> = {
		apps: "Apps",
		"command-line-tools": "Command-Line Tools",
		databases: "Databases",
		frameworks: "Frameworks",
		languages: "Languages",
		specifications: "Specifications",
	}

	// Render.
	return (
		<section className="mx-auto flex max-w-4xl flex-col justify-center text-center">
			<h3 className="font-bold text-xl uppercase">Skills</h3>

			<section className="text-sm">
				<ul className="list-disc space-y-2 text-left">
					{skillSets.map(({ skillSetId, skillSetType, skills }) => (
						<li key={skillSetId}>
							<span className="font-light">
								{skillSetLabels[skillSetType] ?? skillSetType}
								{": "}
							</span>
							<span className="font-extralight text-sm">
								{skills.map((skill) => skill.skill).join(" / ")}
							</span>
						</li>
					))}
				</ul>
			</section>
		</section>
	)
}
