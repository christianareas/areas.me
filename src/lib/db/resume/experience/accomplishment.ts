// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { accomplishments } from "@/lib/db/schema"

// Get accomplishment by candidate ID, role ID, and accomplishment ID.
export async function getAccomplishmentByCandidateIdRoleIdAndAccomplishmentId(
	candidateId: string,
	roleId: string,
	accomplishmentId: string,
) {
	// Select accomplishment.
	const [accomplishment] = await db
		.select({
			candidateId: accomplishments.candidateId,
			roleId: accomplishments.roleId,
			accomplishmentId: accomplishments.accomplishmentId,
			accomplishment: accomplishments.accomplishment,
			sortOrder: accomplishments.sortOrder,
		})
		.from(accomplishments)
		.where(
			and(
				eq(accomplishments.candidateId, candidateId),
				eq(accomplishments.roleId, roleId),
				eq(accomplishments.accomplishmentId, accomplishmentId),
			),
		)
		.limit(1)

	return accomplishment ?? null
}
