// Dependencies.
import type { SkillSet } from "@/lib/db/seed/resume"
import { resume } from "@/lib/db/seed/resume"

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
		"cloud-deployments": "Cloud Deployments",
		languages: "Languages",
		specifications: "Specifications",
	}

	// Render.
	return (
		<section className="mx-auto flex max-w-5xl flex-col justify-center space-y-5 text-center lg:flex-row lg:justify-start lg:space-x-20">
			<h3 className="text-center font-bold text-xl uppercase lg:w-1/6 lg:text-left">
				Skills
			</h3>

			<section className="text-sm lg:w-5/6">
				<ul className="list-disc space-y-2 pl-3 text-left">
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
