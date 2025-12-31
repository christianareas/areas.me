// Dependencies.
import { and, asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { skillSets, skills } from "@/lib/db/schema"

// Types.
type SkillSet = {
	candidateId: string
	skillSetId: string
	skillSetType: string
	sortOrder: number
	skills: Skill[]
}

type Skill = {
	skillId: string
	skill: string
	sortOrder: number
}

// Get skill sets by candidate ID.
export async function getSkillSetsByCandidateId(candidateId: string) {
	// Select skill sets and skills.
	const rows = await db
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
		.orderBy(asc(skillSets.sortOrder), asc(skills.sortOrder))

	// If there are no skill sets, return an empty array.
	if (rows.length === 0) return []

	const skillSetsById = new Map<string, SkillSet>()
	const skillSetList: SkillSet[] = []

	for (const row of rows) {
		let skillSet = skillSetsById.get(row.skillSetId)
		if (!skillSet) {
			skillSet = {
				candidateId: row.candidateId,
				skillSetId: row.skillSetId,
				skillSetType: row.skillSetType,
				sortOrder: row.skillSetSortOrder,
				skills: [],
			}
			skillSetsById.set(row.skillSetId, skillSet)
			skillSetList.push(skillSet)
		}

		if (row.skillId && row.skill !== null && row.skillSortOrder !== null) {
			skillSet.skills.push({
				skillId: row.skillId,
				skill: row.skill,
				sortOrder: row.skillSortOrder,
			})
		}
	}

	return skillSetList
}
