// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { skills } from "@/lib/db/schema"

// Get skill by candidate ID, skill set ID, and skill ID.
export async function getSkillByCandidateIdSkillSetIdAndSkillId(
	candidateId: string,
	skillSetId: string,
	skillId: string,
) {
	const [skill] = await db
		.select({
			candidateId: skills.candidateId,
			skillSetId: skills.skillSetId,
			skillId: skills.skillId,
			skill: skills.skill,
			sortOrder: skills.sortOrder,
		})
		.from(skills)
		.where(
			and(
				eq(skills.candidateId, candidateId),
				eq(skills.skillSetId, skillSetId),
				eq(skills.skillId, skillId),
			),
		)
		.limit(1)

	return skill ?? null
}
