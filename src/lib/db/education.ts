// Dependencies.
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { credentials } from "@/lib/db/schema"

// Get education by candidate ID.
export async function getEducationByCandidateId(candidateId: string) {
	const education = await db
		.select()
		.from(credentials)
		.where(eq(credentials.candidateId, candidateId))

	return education
}
