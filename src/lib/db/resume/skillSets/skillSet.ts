// Dependencies.
import { and, asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { skillSets, skills } from "@/lib/db/schema"

// Get skill set by candidate ID and skill set ID.
export async function getSkillSetByCandidateIdAndSkillSetId(
	candidateId: string,
	skillSetId: string,
) {
	const [skillSet] = await db
		.select({
			candidateId: skillSets.candidateId,
			skillSetId: skillSets.skillSetId,
			skillSetType: skillSets.skillSetType,
			sortOrder: skillSets.sortOrder,
		})
		.from(skillSets)
		.where(
			and(
				eq(skillSets.skillSetId, skillSetId),
				eq(skillSets.candidateId, candidateId),
			),
		)
		.limit(1)

	if (!skillSet) return null

	const skillSetSkills = await db
		.select({
			skillId: skills.skillId,
			skill: skills.skill,
			sortOrder: skills.sortOrder,
		})
		.from(skills)
		.where(
			and(
				eq(skills.candidateId, candidateId),
				eq(skills.skillSetId, skillSetId),
			),
		)
		.orderBy(asc(skills.sortOrder))

	return {
		...skillSet,
		skills: skillSetSkills,
	}
}
