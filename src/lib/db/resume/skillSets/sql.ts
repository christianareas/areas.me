// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { transformSkillSetRowsToObjects } from "@/lib/db/resume/transform"
import { skillSets, skills } from "@/lib/db/schema"

// Skill set fields.
const skillSetFields = {
	candidateId: skillSets.candidateId,
	skillSetId: skillSets.skillSetId,
	skillSetType: skillSets.skillSetType,
	skillSetSortOrder: skillSets.sortOrder,
}

// Skill fields.
const skillFields = {
	skillId: skills.skillId,
	skill: skills.skill,
	sortOrder: skills.sortOrder,
}

//
// Skill sets.
//

// Find skill sets by candidate ID.
export async function findSkillSetsByCandidateId(candidateId: string) {
	// Select skill sets and skills.
	const skillSetRows = await db
		.select({
			...skillSetFields,
			...skillFields,
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

	return transformSkillSetRowsToObjects(skillSetRows)
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
			...skillSetFields,
			...skillFields,
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

	const [skillSetObject] = transformSkillSetRowsToObjects(skillSetRows)
	return skillSetObject ?? null
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
			...skillFields,
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
