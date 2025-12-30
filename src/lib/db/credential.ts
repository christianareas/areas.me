// Dependencies.
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { credentials } from "@/lib/db/schema"

// Get credential by candidate ID and credential ID.
export async function getCredentialByCandidateIdAndCredentialId(
	candidateId: string,
	credentialId: string,
) {
	const [credential] = await db
		.select()
		.from(credentials)
		.where(
			and(
				eq(credentials.credentialId, credentialId),
				eq(credentials.candidateId, candidateId),
			),
		)
		.limit(1)

	return credential ?? null
}
