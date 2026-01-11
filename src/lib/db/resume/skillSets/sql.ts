// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { skillSets, skills } from "@/lib/db/schema"
import type { SkillSet } from "@/types/resume"

//
// Skill sets.
//

// Find skill sets by candidate ID.
export async function findSkillSetsByCandidateId(candidateId: string) {
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

//
// Skill set.
//

// Find skill set by candidate ID and skill set ID.
export async function findSkillSetByCandidateIdAndSkillSetId(
	candidateId: string,
	skillSetId: string,
) {
	// Select skill set and skills.
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
		sortOrder: firstSkillSetRow.skillSetSortOrder,
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

//
// Skills.
//

// Find skill by candidate ID, skill set ID, and skill ID.
export async function findSkillByCandidateIdAndSkillSetIdAndSkillId(
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
