// Dependencies.
import { and, asc, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { skillSets, skills } from "@/lib/db/schema"

// Types.
type Skill = {
	skillId: string
	skill: string
	sortOrder: number
}

const skillsBySkillSetId = new Map<string, Skill[]>()

// Get skill sets by candidate ID.
export async function getSkillSetsByCandidateId(candidateId: string) {
	// Select skill sets.
	const skillSetRows = await db
		.select({
			candidateId: skillSets.candidateId,
			skillSetId: skillSets.skillSetId,
			skillSetType: skillSets.skillSetType,
			sortOrder: skillSets.sortOrder,
		})
		.from(skillSets)
		.where(eq(skillSets.candidateId, candidateId))
		.orderBy(asc(skillSets.sortOrder))

	// If there are no skill sets, return an empty array.
	if (skillSetRows.length === 0) return []

	// Select skills.
	const skillRows = await db
		.select({
			skillSetId: skills.skillSetId,
			skillId: skills.skillId,
			skill: skills.skill,
			sortOrder: skills.sortOrder,
		})
		.from(skills)
		.where(
			and(
				eq(skills.candidateId, candidateId),
				inArray(
					skills.skillSetId,
					skillSetRows.map((skillSet) => skillSet.skillSetId),
				),
			),
		)
		.orderBy(asc(skills.skillSetId), asc(skills.sortOrder))

	// Group skills by skill set.
	for (const skillRow of skillRows) {
		const skills = skillsBySkillSetId.get(skillRow.skillSetId) ?? []
		skills.push({
			skillId: skillRow.skillId,
			skill: skillRow.skill,
			sortOrder: skillRow.sortOrder,
		})
		skillsBySkillSetId.set(skillRow.skillSetId, skills)
	}

	return skillSetRows.map((skillSet) => ({
		...skillSet,
		skills: skillsBySkillSetId.get(skillSet.skillSetId) ?? [],
	}))
}
