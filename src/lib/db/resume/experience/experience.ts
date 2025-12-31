// Dependencies.
import { and, asc, desc, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { accomplishments, roles } from "@/lib/db/schema"

// Types.
type Accomplishment = {
	accomplishmentId: string
	accomplishment: string
	sortOrder: number
}

// Get experience by candidate ID.
export async function getExperienceByCandidateId(candidateId: string) {
	// Select roles.
	const roleRows = await db
		.select({
			candidateId: roles.candidateId,
			roleId: roles.roleId,
			company: roles.company,
			role: roles.role,
			startDate: roles.startDate,
			endDate: roles.endDate,
		})
		.from(roles)
		.where(eq(roles.candidateId, candidateId))
		.orderBy(desc(roles.startDate), desc(roles.endDate), asc(roles.company))

	// If there are no roles, return an empty array.
	if (roleRows.length === 0) return []

	// Select accomplishments.
	const accomplishmentRows = await db
		.select({
			roleId: accomplishments.roleId,
			accomplishmentId: accomplishments.accomplishmentId,
			accomplishment: accomplishments.accomplishment,
			sortOrder: accomplishments.sortOrder,
		})
		.from(accomplishments)
		.where(
			and(
				eq(accomplishments.candidateId, candidateId),
				inArray(
					accomplishments.roleId,
					roleRows.map((role) => role.roleId),
				),
			),
		)
		.orderBy(asc(accomplishments.roleId), asc(accomplishments.sortOrder))

	// Group accomplishments by role.
	const accomplishmentsByRoleId = new Map<string, Accomplishment[]>()

	for (const accomplishmentRow of accomplishmentRows) {
		const accomplishments =
			accomplishmentsByRoleId.get(accomplishmentRow.roleId) ?? []
		accomplishments.push({
			accomplishmentId: accomplishmentRow.accomplishmentId,
			accomplishment: accomplishmentRow.accomplishment,
			sortOrder: accomplishmentRow.sortOrder,
		})
		accomplishmentsByRoleId.set(accomplishmentRow.roleId, accomplishments)
	}

	return roleRows.map((role) => ({
		...role,
		accomplishments: accomplishmentsByRoleId.get(role.roleId) ?? [],
	}))
}
