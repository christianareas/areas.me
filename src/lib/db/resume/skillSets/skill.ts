// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { skillSets, skills } from "@/lib/db/schema"

// Get skill by candidate ID, skill set ID, and skill ID.
export async function getSkillByCandidateIdSkillSetIdAndSkillId(
	candidateId: string,
	skillSetId: string,
	skillId: string,
) {
	// Select skill set and skill.
	const [skill] = await db
		.select({
			candidateId: skillSets.candidateId,
			skillSetId: skillSets.skillSetId,
			skillId: skills.skillId,
			skill: skills.skill,
			sortOrder: skills.sortOrder,
		})
		.from(skillSets)
		.innerJoin(
			skills,
			and(
				eq(skills.candidateId, skillSets.candidateId),
				eq(skills.skillSetId, skillSets.skillSetId),
			),
		)
		.where(
			and(
				eq(skillSets.candidateId, candidateId),
				eq(skillSets.skillSetId, skillSetId),
				eq(skills.skillId, skillId),
			),
		)
		.limit(1)

	return skill ?? null
}
