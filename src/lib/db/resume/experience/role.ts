// Dependencies.
import { and, asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { accomplishments, roles } from "@/lib/db/schema"

// Get role by candidate ID and role ID.
export async function getRoleByCandidateIdAndRoleId(
	candidateId: string,
	roleId: string,
) {
	// Select role.
	const [role] = await db
		.select({
			candidateId: roles.candidateId,
			roleId: roles.roleId,
			company: roles.company,
			role: roles.role,
			startDate: roles.startDate,
			endDate: roles.endDate,
		})
		.from(roles)
		.where(and(eq(roles.candidateId, candidateId), eq(roles.roleId, roleId)))
		.limit(1)

	// If there’s no role, return null.
	if (!role) return null

	// Select accomplishments.
	const roleAccomplishments = await db
		.select({
			accomplishmentId: accomplishments.accomplishmentId,
			accomplishment: accomplishments.accomplishment,
			sortOrder: accomplishments.sortOrder,
		})
		.from(accomplishments)
		.where(
			and(
				eq(accomplishments.candidateId, candidateId),
				eq(accomplishments.roleId, roleId),
			),
		)
		.orderBy(asc(accomplishments.sortOrder))

	return {
		...role,
		accomplishments: roleAccomplishments,
	}
}
