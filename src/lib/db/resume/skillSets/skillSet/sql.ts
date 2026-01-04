// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { skillSets, skills } from "@/lib/db/schema"

// Get skill set by candidate ID and skill set ID.
export async function getSkillSetByCandidateIdAndSkillSetId(
	candidateId: string,
	skillSetId: string,
) {
	// Select skill set and skills.
	const skillSetRows = await db
		.select({
			candidateId: skillSets.candidateId,
			skillSetId: skillSets.skillSetId,
			skillSetType: skillSets.skillSetType,
			sortOrder: skillSets.sortOrder,
			skillId: skills.skillId,
			skill: skills.skill,
			skillSortOrder: skills.sortOrder,
		})
		.from(skillSets)
		.leftJoin(
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
			),
		)
		.orderBy(skills.sortOrder)

	// If there’s no skill set, return null.
	if (skillSetRows.length === 0) return null

	// Convert the database rows to an object.
	const firstSkillSetRow = skillSetRows[0]
	const skillSetObject = {
		candidateId: firstSkillSetRow.candidateId,
		skillSetId: firstSkillSetRow.skillSetId,
		skillSetType: firstSkillSetRow.skillSetType,
		sortOrder: firstSkillSetRow.sortOrder,
		skills: skillSetRows
			.filter(
				(skillRow) =>
					skillRow.skillId !== null &&
					skillRow.skill !== null &&
					skillRow.skillSortOrder !== null,
			)
			.map((skillRow) => ({
				skillId: skillRow.skillId,
				skill: skillRow.skill,
				sortOrder: skillRow.skillSortOrder,
			})),
	}

	return skillSetObject
}
