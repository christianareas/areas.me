// Dependencies.
import { and, asc, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { accomplishments, roles } from "@/lib/db/schema"

// Types.
type Role = {
	candidateId: string
	roleId: string
	company: string
	role: string
	startDate: string
	endDate: string | null
	accomplishments: Accomplishment[]
}

type Accomplishment = {
	accomplishmentId: string
	accomplishment: string
	sortOrder: number
}

// Get experience by candidate ID.
export async function getExperienceByCandidateId(candidateId: string) {
	// Select roles and accomplishments.
	const rows = await db
		.select({
			candidateId: roles.candidateId,
			roleId: roles.roleId,
			company: roles.company,
			role: roles.role,
			startDate: roles.startDate,
			endDate: roles.endDate,
			accomplishmentId: accomplishments.accomplishmentId,
			accomplishment: accomplishments.accomplishment,
			accomplishmentSortOrder: accomplishments.sortOrder,
		})
		.from(roles)
		.leftJoin(
			accomplishments,
			and(
				eq(accomplishments.candidateId, roles.candidateId),
				eq(accomplishments.roleId, roles.roleId),
			),
		)
		.where(eq(roles.candidateId, candidateId))
		.orderBy(
			desc(roles.endDate),
			desc(roles.startDate),
			asc(roles.company),
			asc(accomplishments.sortOrder),
		)

	// If there are no roles, return an empty array.
	if (rows.length === 0) return []

	const rolesById = new Map<string, Role>()
	const roleList: Role[] = []

	for (const row of rows) {
		let role = rolesById.get(row.roleId)
		if (!role) {
			role = {
				candidateId: row.candidateId,
				roleId: row.roleId,
				company: row.company,
				role: row.role,
				startDate: row.startDate,
				endDate: row.endDate,
				accomplishments: [],
			}
			rolesById.set(row.roleId, role)
			roleList.push(role)
		}

		if (
			row.accomplishmentId &&
			row.accomplishment !== null &&
			row.accomplishmentSortOrder !== null
		) {
			role.accomplishments.push({
				accomplishmentId: row.accomplishmentId,
				accomplishment: row.accomplishment,
				sortOrder: row.accomplishmentSortOrder,
			})
		}
	}

	return roleList
}
