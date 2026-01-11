// Dependencies.
import { randomUUID } from "node:crypto"
import { and, eq, sql } from "drizzle-orm"
import type {
	CredentialCreate,
	CredentialUpdate,
} from "@/lib/api/schemas/resume/education/contract"
import { db } from "@/lib/db"
import { credentials } from "@/lib/db/schema"

// Credential fields.
const credentialFields = {
	candidateId: credentials.candidateId,
	credentialId: credentials.credentialId,
	institution: credentials.institution,
	credential: credentials.credential,
	startDate: credentials.startDate,
	endDate: credentials.endDate,
}

//
// Education.
//

// Find education by candidate ID.
export async function findEducationByCandidateId(candidateId: string) {
	// Select credentials.
	const education = await db
		.select(credentialFields)
		.from(credentials)
		.where(eq(credentials.candidateId, candidateId))
		.orderBy(
			sql`${credentials.endDate} DESC NULLS FIRST`,
			sql`${credentials.startDate} DESC NULLS FIRST`,
		)

	return education
}

// Replace education by candidate ID.

// Delete education by candidate ID.
export async function deleteEducationByCandidateId(candidateId: string) {
	// Delete credentials.
	const deletedEducation = await db
		.delete(credentials)
		.where(eq(credentials.candidateId, candidateId))
		.returning({ candidateId: credentials.candidateId })

	return deletedEducation
}

//
// Credential.
//

// Create credentials by candidate ID.
export async function createCredentialsByCandidateId(
	candidateId: string,
	credentialCreates: CredentialCreate[],
) {
	// **
	if (credentialCreates.length === 0) return []

	return db
		.insert(credentials)
		.values(
			credentialCreates.map((credential) => ({
				...credential,
				candidateId,
				credentialId: randomUUID(),
			})),
		)
		.returning(credentialFields)
}

// Create credential by candidate ID.
export async function createCredentialByCandidateId(
	candidateId: string,
	credentialCreate: CredentialCreate,
) {
	const [newCredential] = await createCredentialsByCandidateId(candidateId, [
		credentialCreate,
	])

	return newCredential ?? null
}

// Find credential by candidate ID and credential ID.
export async function findCredentialByCandidateIdAndCredentialId(
	candidateId: string,
	credentialId: string,
) {
	// Select credential.
	const [credential] = await db
		.select(credentialFields)
		.from(credentials)
		.where(
			and(
				eq(credentials.candidateId, candidateId),
				eq(credentials.credentialId, credentialId),
			),
		)
		.limit(1)

	return credential ?? null
}

// Update credential by candidate ID and credential ID.
export async function updateCredentialByCandidateIdAndCredentialId(
	candidateId: string,
	credentialId: string,
	credentialUpdate: CredentialUpdate,
) {
	// Update credential.
	const [updatedCredential] = await db
		.update(credentials)
		.set({
			...credentialUpdate,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(credentials.candidateId, candidateId),
				eq(credentials.credentialId, credentialId),
			),
		)
		.returning({
			...credentialFields,
			updatedAt: credentials.updatedAt,
		})

	return updatedCredential ?? null
}

// Delete credential by candidate ID and credential ID.
export async function deleteCredentialByCandidateIdAndCredentialId(
	candidateId: string,
	credentialId: string,
) {
	// Delete credential.
	const [deletedCredential] = await db
		.delete(credentials)
		.where(
			and(
				eq(credentials.candidateId, candidateId),
				eq(credentials.credentialId, credentialId),
			),
		)
		.returning({ candidateId: credentials.candidateId })

	return deletedCredential ?? null
}
