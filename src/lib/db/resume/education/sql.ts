// Dependencies.
import { eq, sql } from "drizzle-orm"
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

// Delete education by candidate ID.
export async function deleteEducationByCandidateId(candidateId: string) {
	// Delete credentials.
	const deletedEducation = await db
		.delete(credentials)
		.where(eq(credentials.candidateId, candidateId))
		.returning({ candidateId: credentials.candidateId })

	return deletedEducation
}
