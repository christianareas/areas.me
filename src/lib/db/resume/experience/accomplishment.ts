// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { accomplishments, candidates, roles } from "@/lib/db/schema"

// Get accomplishment by candidate ID, role ID, and accomplishment ID.
export async function getAccomplishmentByCandidateIdRoleIdAndAccomplishmentId(
	candidateId: string,
	roleId: string,
	accomplishmentId: string,
) {
	// Select candidate, role, and accomplishment.
	const [accomplishment] = await db
		.select({
			candidateId: candidates.candidateId,
			roleId: roles.roleId,
			accomplishmentId: accomplishments.accomplishmentId,
			accomplishment: accomplishments.accomplishment,
			sortOrder: accomplishments.sortOrder,
		})
		.from(candidates)
		.leftJoin(
			roles,
			and(
				eq(roles.candidateId, candidates.candidateId),
				eq(roles.roleId, roleId),
			),
		)
		.leftJoin(
			accomplishments,
			and(
				eq(accomplishments.candidateId, candidates.candidateId),
				eq(accomplishments.roleId, roles.roleId),
				eq(accomplishments.accomplishmentId, accomplishmentId),
			),
		)
		.where(eq(candidates.candidateId, candidateId))
		.limit(1)

	return accomplishment ?? null
}
