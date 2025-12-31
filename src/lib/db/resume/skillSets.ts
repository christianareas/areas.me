// Dependencies.
import { and, asc, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { skillSets, skills } from "@/lib/db/schema"

// Get skill sets by candidate ID.
export async function getSkillSetsByCandidateId(candidateId: string) {
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

	if (skillSetRows.length === 0) return []

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
					skillSetRows.map((s) => s.skillSetId),
				),
			),
		)
		.orderBy(asc(skills.skillSetId), asc(skills.sortOrder))

	type Skill = {
		skillId: string
		skill: string
		sortOrder: number
	}

	const skillsBySkillSetId = new Map<string, Skill[]>()

	for (const row of skillRows) {
		const list = skillsBySkillSetId.get(row.skillSetId) ?? []
		list.push({
			skillId: row.skillId,
			skill: row.skill,
			sortOrder: row.sortOrder,
		})
		skillsBySkillSetId.set(row.skillSetId, list)
	}

	return skillSetRows.map((s) => ({
		...s,
		skills: skillsBySkillSetId.get(s.skillSetId) ?? [],
	}))
}
