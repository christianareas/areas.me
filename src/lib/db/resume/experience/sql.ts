// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { randomUUID } from "node:crypto"
import { and, desc, eq, sql } from "drizzle-orm"
import type {
	AccomplishmentCreate,
	AccomplishmentUpdate,
	RoleCreate,
	RoleUpdate,
} from "@/lib/api/schemas/resume/experience/contract"
import { db } from "@/lib/db"
import { transformRoleRowsToObjects } from "@/lib/db/resume/transform"
import { accomplishments, roles } from "@/lib/db/schema"

// --------------------------------------------------------------------------------
// Fields.
// --------------------------------------------------------------------------------

const roleFields = {
	candidateId: roles.candidateId,
	roleId: roles.roleId,
	company: roles.company,
	role: roles.role,
	startDate: roles.startDate,
	endDate: roles.endDate,
}

const accomplishmentFields = {
	accomplishmentId: accomplishments.accomplishmentId,
	accomplishment: accomplishments.accomplishment,
	sortOrder: accomplishments.sortOrder,
}

// --------------------------------------------------------------------------------
// Roles.
// --------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------
// Role.
// --------------------------------------------------------------------------------

export async function createRoleByCandidateId(
	candidateId: string,
	roleCreate: RoleCreate,
) {
	const roleId = randomUUID()
	const { company, role, startDate, endDate } = roleCreate
	const { accomplishments: accomplishmentsCreate = [] } = roleCreate

	// Insert role and accomplishments.
	return db.transaction(async (tx) => {
		// Insert role.
		const [newRole] = await tx
			.insert(roles)
			.values({
				candidateId,
				roleId,
				company,
				role,
				startDate,
				endDate,
			})
			.returning({
				candidateId: roles.candidateId,
				roleId: roles.roleId,
				company: roles.company,
				role: roles.role,
				startDate: roles.startDate,
				endDate: roles.endDate,
				createdAt: roles.createdAt,
			})

		if (!newRole) return null

		// Insert accomplishments.
		let newAccomplishments: {
			accomplishmentId: string
			accomplishment: string
			sortOrder: number
		}[] = []
		if (accomplishmentsCreate.length > 0) {
			newAccomplishments = await tx
				.insert(accomplishments)
				.values(
					accomplishmentsCreate.map((accomplishmentCreate) => ({
						candidateId,
						roleId,
						accomplishmentId: randomUUID(),
						...accomplishmentCreate,
					})),
				)
				.returning({
					accomplishmentId: accomplishments.accomplishmentId,
					accomplishment: accomplishments.accomplishment,
					sortOrder: accomplishments.sortOrder,
				})
		}

		return {
			...newRole,
			accomplishments: newAccomplishments,
		}
	})
}

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

export async function updateRoleByCandidateIdAndRoleId(
	candidateId: string,
	roleId: string,
	roleUpdate: RoleUpdate,
) {
	// Update role.
	const [updatedRole] = await db
		.update(roles)
		.set({
			...roleUpdate,
			updatedAt: new Date(),
		})
		.where(and(eq(roles.candidateId, candidateId), eq(roles.roleId, roleId)))
		.returning({
			candidateId: roles.candidateId,
			roleId: roles.roleId,
			company: roles.company,
			role: roles.role,
			startDate: roles.startDate,
			endDate: roles.endDate,
			updatedAt: roles.updatedAt,
		})

	return updatedRole ?? null
}

export async function deleteRoleByCandidateIdAndRoleId(
	candidateId: string,
	roleId: string,
) {
	// Delete role.
	const [deletedRole] = await db
		.delete(roles)
		.where(and(eq(roles.candidateId, candidateId), eq(roles.roleId, roleId)))
		.returning({ candidateId: roles.candidateId })

	return deletedRole ?? null
}

// --------------------------------------------------------------------------------
// Accomplishment.
// --------------------------------------------------------------------------------

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

export async function findAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId(
	candidateId: string,
	roleId: string,
	accomplishmentId: string,
) {
	// Select role and accomplishment.
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

// --------------------------------------------------------------------------------
