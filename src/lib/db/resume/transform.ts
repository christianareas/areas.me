// Dependencies.
import type { Role, SkillSet } from "@/types/resume"

// Types.
type ExperienceRow = {
	candidateId: string
	roleId: string
	company: string
	role: string
	startDate: string
	endDate: string | null
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

// Transform experience rows to an array of objects.
export function transformExperienceRowsToObjects(rows: ExperienceRow[]) {
	// If there are no rows, return an empty array.
	if (rows.length === 0) return []

	// Transform rows to an array of objects.
	const arrayOfObjects: Role[] = []
	let currentObject: Role | null = null
	for (const row of rows) {
		// If it’s a new role, create a new role object.
		if (!currentObject || currentObject.roleId !== row.roleId) {
			currentObject = {
				candidateId: row.candidateId,
				roleId: row.roleId,
				company: row.company,
				role: row.role,
				startDate: row.startDate,
				endDate: row.endDate,
				accomplishments: [],
			}
			arrayOfObjects.push(currentObject)
		}

		// If there’s an accomplishment, add it to the current role object.
		if (
			row.accomplishmentId !== null &&
			row.accomplishment !== null &&
			row.sortOrder !== null
		) {
			currentObject.accomplishments.push({
				accomplishmentId: row.accomplishmentId,
				accomplishment: row.accomplishment,
				sortOrder: row.sortOrder,
			})
		}
	}

	return arrayOfObjects
}

// Transform skill set rows to an array of objects.
export function transformSkillSetRowsToObjects(rows: SkillSetRow[]) {
	// If there are no rows, return an empty array.
	if (rows.length === 0) return []

	// Transform rows to an array of objects.
	const arrayOfObjects: SkillSet[] = []
	let currentObject: SkillSet | null = null
	for (const row of rows) {
		// If it’s a new skill set, create a new skill set object.
		if (!currentObject || currentObject.skillSetId !== row.skillSetId) {
			currentObject = {
				candidateId: row.candidateId,
				skillSetId: row.skillSetId,
				skillSetType: row.skillSetType,
				sortOrder: row.skillSetSortOrder,
				skills: [],
			}
			arrayOfObjects.push(currentObject)
		}

		// If there’s a skill, add it to the current skill set object.
		if (row.skillId !== null && row.skill !== null && row.sortOrder !== null) {
			currentObject.skills.push({
				skillId: row.skillId,
				skill: row.skill,
				sortOrder: row.sortOrder,
			})
		}
	}

	return arrayOfObjects
}
