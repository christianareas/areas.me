// Dependencies.
import { randomUUID } from "node:crypto"
import { and, desc, eq, sql } from "drizzle-orm"
import type {
	AccomplishmentCreate,
	AccomplishmentUpdate,
} from "@/lib/api/schemas/resume/experience/contract"
import { db } from "@/lib/db"
import { transformRoleRowsToObjects } from "@/lib/db/resume/transform"
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

// Find roles by candidate ID.
export async function findRolesByCandidateId(candidateId: string) {
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

	return transformRoleRowsToObjects(roleRows)
}

//
// Role.
//

// Find role by candidate ID and role ID.
export async function findRoleByCandidateIdAndRoleId(
	candidateId: string,
	roleId: string,
) {
	// Select role and accomplishments.
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
		.where(and(eq(roles.candidateId, candidateId), eq(roles.roleId, roleId)))
		.orderBy(accomplishments.sortOrder)

	const [roleObject] = transformRoleRowsToObjects(roleRows)

	return roleObject ?? null
}

//
// Accomplishment.
//

// Create accomplishment by candidate ID and role ID.
export async function createAccomplishmentByCandidateIdAndRoleId(
	candidateId: string,
	roleId: string,
	accomplishmentCreate: AccomplishmentCreate,
) {
	// Insert accomplishment.
	const [newAccomplishment] = await db
		.insert(accomplishments)
		.values({
			...accomplishmentCreate,
			candidateId,
			roleId,
			accomplishmentId: randomUUID(),
		})
		.returning({
			candidateId: accomplishments.candidateId,
			roleId: accomplishments.roleId,
			...accomplishmentFields,
			createdAt: accomplishments.createdAt,
		})

	return newAccomplishment ?? null
}

// Find accomplishment by candidate ID, role ID, and accomplishment ID.
export async function findAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId(
	candidateId: string,
	roleId: string,
	accomplishmentId: string,
) {
	// Select role and accomplishments.
	const [accomplishment] = await db
		.select({
			candidateId: roles.candidateId,
			roleId: roles.roleId,
			...accomplishmentFields,
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

// Update accomplishment by candidate ID, role ID, and accomplishment ID.
export async function updateAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId(
	candidateId: string,
	roleId: string,
	accomplishmentId: string,
	accomplishmentUpdate: AccomplishmentUpdate,
) {
	// Update accomplishment.
	const [updatedAccomplishment] = await db
		.update(accomplishments)
		.set({ ...accomplishmentUpdate, updatedAt: new Date() })
		.where(
			and(
				eq(accomplishments.candidateId, candidateId),
				eq(accomplishments.roleId, roleId),
				eq(accomplishments.accomplishmentId, accomplishmentId),
			),
		)
		.returning({
			candidateId: accomplishments.candidateId,
			roleId: accomplishments.roleId,
			...accomplishmentFields,
			updatedAt: accomplishments.updatedAt,
		})

	return updatedAccomplishment ?? null
}

// Delete accomplishment by candidate ID, role ID, and accomplishment ID.
export async function deleteAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId(
	candidateId: string,
	roleId: string,
	accomplishmentId: string,
) {
	// Delete accomplishment.
	const [deletedAccomplishment] = await db
		.delete(accomplishments)
		.where(
			and(
				eq(accomplishments.candidateId, candidateId),
				eq(accomplishments.roleId, roleId),
				eq(accomplishments.accomplishmentId, accomplishmentId),
			),
		)
		.returning({ candidateId: accomplishments.candidateId })

	return deletedAccomplishment ?? null
}
