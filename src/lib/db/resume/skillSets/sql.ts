// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { skillSets, skills } from "@/lib/db/schema"
import type { SkillSet } from "@/types/resume"

// Get skill sets by candidate ID.
export async function getSkillSetsByCandidateId(candidateId: string) {
	// Select skill sets and skills.
	const skillSetRows = await db
		.select({
			candidateId: skillSets.candidateId,
			skillSetId: skillSets.skillSetId,
			skillSetType: skillSets.skillSetType,
			skillSetSortOrder: skillSets.sortOrder,
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
		.where(eq(skillSets.candidateId, candidateId))
		.orderBy(skillSets.sortOrder, skillSets.skillSetId, skills.sortOrder)

	// If there are no skill sets, return an empty array.
	if (skillSetRows.length === 0) return []

	// Convert the database rows to an object.
	const skillSetsObject: SkillSet[] = []
	let currentSkillSetObject: SkillSet | null = null
	for (const skillSetRow of skillSetRows) {
		if (
			!currentSkillSetObject ||
			currentSkillSetObject.skillSetId !== skillSetRow.skillSetId
		) {
			currentSkillSetObject = {
				candidateId: skillSetRow.candidateId,
				skillSetId: skillSetRow.skillSetId,
				skillSetType: skillSetRow.skillSetType,
				sortOrder: skillSetRow.skillSetSortOrder,
				skills: [],
			}
			skillSetsObject.push(currentSkillSetObject)
		}

		if (
			skillSetRow.skillId !== null &&
			skillSetRow.skill !== null &&
			skillSetRow.skillSortOrder !== null
		) {
			currentSkillSetObject.skills.push({
				skillId: skillSetRow.skillId,
				skill: skillSetRow.skill,
				sortOrder: skillSetRow.skillSortOrder,
			})
		}
	}

	return skillSetsObject
}
