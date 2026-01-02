// Dependencies.
import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { accomplishments, roles } from "@/lib/db/schema"
import type { Role } from "@/types/resume"

// Get experience by candidate ID.
export async function getExperienceByCandidateId(candidateId: string) {
	// Select roles and accomplishments.
	const roleRows = await db
		.select({
			candidateId: roles.candidateId,
			roleId: roles.roleId,
			company: roles.company,
			role: roles.role,
			startDate: roles.startDate,
			endDate: roles.endDate,
			accomplishmentId: accomplishments.accomplishmentId,
			accomplishment: accomplishments.accomplishment,
			sortOrder: accomplishments.sortOrder,
		})
		.from(roles)
		.leftJoin(
			accomplishments,
			and(
				eq(roles.candidateId, accomplishments.candidateId),
				eq(roles.roleId, accomplishments.roleId),
			),
		)
		.where(eq(roles.candidateId, candidateId))
		.orderBy(
			sql`${roles.endDate} DESC NULLS FIRST`,
			desc(roles.startDate),
			roles.company,
			roles.role,
			roles.roleId,
			accomplishments.sortOrder,
		)

	// If there are no roles, return an empty array.
	if (roleRows.length === 0) return []

	// Convert the database rows to an object.
	const rolesObject = []
	let currentRoleObject: Role | null = null
	for (const roleRow of roleRows) {
		if (!currentRoleObject || currentRoleObject.roleId !== roleRow.roleId) {
			currentRoleObject = {
				candidateId: roleRow.candidateId,
				roleId: roleRow.roleId,
				company: roleRow.company,
				role: roleRow.role,
				startDate: roleRow.startDate,
				endDate: roleRow.endDate,
				accomplishments: [],
			}
			rolesObject.push(currentRoleObject)
		}
		if (
			roleRow.accomplishmentId !== null &&
			roleRow.accomplishment !== null &&
			roleRow.sortOrder !== null
		) {
			currentRoleObject.accomplishments.push({
				accomplishmentId: roleRow.accomplishmentId,
				accomplishment: roleRow.accomplishment,
				sortOrder: roleRow.sortOrder,
			})
		}
	}

	return rolesObject
}
