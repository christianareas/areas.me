// Dependencies.
import { desc, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { credentials } from "@/lib/db/schema"

// Get education by candidate ID.
export async function getEducationByCandidateId(candidateId: string) {
	// Select credentials.
	const education = await db
		.select({
			candidateId: credentials.candidateId,
			credentialId: credentials.credentialId,
			institution: credentials.institution,
			credential: credentials.credential,
			startDate: credentials.startDate,
			endDate: credentials.endDate,
		})
		.from(credentials)
		.where(eq(credentials.candidateId, candidateId))
		.orderBy(
			sql`${credentials.endDate} DESC NULLS FIRST`,
			sql`${credentials.startDate} DESC NULLS LAST`,
		)

	return education
}
