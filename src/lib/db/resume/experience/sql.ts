// Dependencies.
import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { transformExperienceRowsToObjects } from "@/lib/db/resume/transform"
import { accomplishments, roles } from "@/lib/db/schema"

// Role fields.
const roleFields = {
	candidateId: roles.candidateId,
	roleId: roles.roleId,
	company: roles.company,
	role: roles.role,
	startDate: roles.startDate,
	endDate: roles.endDate,
}

// Accomplishment fields.
const accomplishmentFields = {
	accomplishmentId: accomplishments.accomplishmentId,
	accomplishment: accomplishments.accomplishment,
	sortOrder: accomplishments.sortOrder,
}

//
// Experience.
//

// Find experience by candidate ID.
export async function findExperienceByCandidateId(candidateId: string) {
	// Select roles and accomplishments.
	const roleRows = await db
		.select({
			...roleFields,
			...accomplishmentFields,
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

	return transformExperienceRowsToObjects(roleRows)
}
