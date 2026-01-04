// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { accomplishments, roles } from "@/lib/db/schema"

// Find accomplishment by candidate ID, role ID, and accomplishment ID.
export async function findAccomplishmentByCandidateIdRoleIdAndAccomplishmentId(
	candidateId: string,
	roleId: string,
	accomplishmentId: string,
) {
	// Select role and accomplishments.
	const [accomplishment] = await db
		.select({
			candidateId: roles.candidateId,
			roleId: roles.roleId,
			accomplishmentId: accomplishments.accomplishmentId,
			accomplishment: accomplishments.accomplishment,
			sortOrder: accomplishments.sortOrder,
		})
		.from(roles)
		.innerJoin(
			accomplishments,
			and(
				eq(roles.candidateId, accomplishments.candidateId),
				eq(roles.roleId, accomplishments.roleId),
			),
		)
		.where(
			and(
				eq(roles.candidateId, candidateId),
				eq(roles.roleId, roleId),
				eq(accomplishments.accomplishmentId, accomplishmentId),
			),
		)
		.limit(1)

	return accomplishment ?? null
}
