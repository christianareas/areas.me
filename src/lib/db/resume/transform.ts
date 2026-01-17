// Dependencies.
import type { SkillSet } from "@/types/resume"

// Types.
type ExperienceRow = {
	candidateId: string
	roleId: string
	company: string
	role: string
	startDate: Date | null
	endDate: Date | null
	accomplishmentId: string | null
	accomplishment: string | null
	sortOrder: number | null
}

type SkillSetRow = {
	candidateId: string
	skillSetId: string
	skillSetType: string
	skillSetSortOrder: number
	skillId: string | null
	skill: string | null
	sortOrder: number | null
}

// Transform skill set rows to objects.
export function transformSkillSetRowsToObjects(skillSetRows: SkillSetRow[]) {
	// If there are no rows, return an empty array.
	if (skillSetRows.length === 0) return []

	// Transform rows to objects.
	const skillSetsObject: SkillSet[] = []
	let currentSkillSetObject: SkillSet | null = null
	for (const skillSetRow of skillSetRows) {
		// If this is a new skill set, create a new skill set object.
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

		// If there is a skill, add it to the current skill set object.
		if (
			skillSetRow.skillId !== null &&
			skillSetRow.skill !== null &&
			skillSetRow.sortOrder !== null
		) {
			currentSkillSetObject.skills.push({
				skillId: skillSetRow.skillId,
				skill: skillSetRow.skill,
				sortOrder: skillSetRow.sortOrder,
			})
		}
	}

	return skillSetsObject
}
