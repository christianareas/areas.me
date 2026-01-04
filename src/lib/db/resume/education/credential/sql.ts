// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { credentials } from "@/lib/db/schema"

// Find credential by candidate ID and credential ID.
export async function findCredentialByCandidateIdAndCredentialId(
	candidateId: string,
	credentialId: string,
) {
	// Select credential.
	const [credential] = await db
		.select({
			candidateId: credentials.candidateId,
			credentialId: credentials.credentialId,
			institution: credentials.institution,
			credential: credentials.credential,
			startDate: credentials.startDate,
			endDate: credentials.endDate,
		})
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
