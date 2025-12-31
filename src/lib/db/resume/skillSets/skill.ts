// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { candidates, skillSets, skills } from "@/lib/db/schema"

// Get skill by candidate ID, skill set ID, and skill ID.
export async function getSkillByCandidateIdSkillSetIdAndSkillId(
	candidateId: string,
	skillSetId: string,
	skillId: string,
) {
	// Select candidate, skill set, and skill.
	const [skill] = await db
		.select({
			candidateId: candidates.candidateId,
			skillSetId: skillSets.skillSetId,
			skillId: skills.skillId,
			skill: skills.skill,
			sortOrder: skills.sortOrder,
		})
		.from(candidates)
		.leftJoin(
			skillSets,
			and(
				eq(skillSets.candidateId, candidates.candidateId),
				eq(skillSets.skillSetId, skillSetId),
			),
		)
		.leftJoin(
			skills,
			and(
				eq(skills.candidateId, candidates.candidateId),
				eq(skills.skillSetId, skillSets.skillSetId),
				eq(skills.skillId, skillId),
			),
		)
		.where(eq(candidates.candidateId, candidateId))
		.limit(1)

	return skill ?? null
}
