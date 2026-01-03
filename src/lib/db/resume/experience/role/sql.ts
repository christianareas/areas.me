// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { accomplishments, roles } from "@/lib/db/schema"

// Get role by candidate ID and role ID.
export async function getRoleByCandidateIdAndRoleId(
	candidateId: string,
	roleId: string,
) {
	// Select role and accomplishments.
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
		.where(and(eq(roles.candidateId, candidateId), eq(roles.roleId, roleId)))
		.orderBy(accomplishments.sortOrder)

	// If there’s no role, return null.
	if (roleRows.length === 0) return null

	// Convert the database rows to an object.
	const firstRoleRow = roleRows[0]
	const roleObject = {
		candidateId: firstRoleRow.candidateId,
		roleId: firstRoleRow.roleId,
		company: firstRoleRow.company,
		role: firstRoleRow.role,
		startDate: firstRoleRow.startDate,
		endDate: firstRoleRow.endDate,
		accomplishments: roleRows
			.filter(
				(accomplishmentRow) =>
					accomplishmentRow.accomplishmentId !== null &&
					accomplishmentRow.accomplishment !== null &&
					accomplishmentRow.sortOrder !== null,
			)
			.map((accomplishmentRow) => ({
				accomplishmentId: accomplishmentRow.accomplishmentId,
				accomplishment: accomplishmentRow.accomplishment,
				sortOrder: accomplishmentRow.sortOrder,
			})),
	}

	return roleObject
}
