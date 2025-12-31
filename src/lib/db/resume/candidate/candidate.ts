// Dependencies.
import { eq } from "drizzle-orm"
import type { CandidatePatch } from "@/lib/api/schemas/candidate"
import { db } from "@/lib/db"
import { candidates } from "@/lib/db/schema"

// Get candidate by candidate ID.
export async function getCandidateByCandidateId(candidateId: string) {
	// Select candidate.
	const [candidate] = await db
		.select({
			candidateId: candidates.candidateId,
			firstName: candidates.firstName,
			middleName: candidates.middleName,
			lastName: candidates.lastName,
			who: candidates.who,
			email: candidates.email,
			phoneCountryCode: candidates.phoneCountryCode,
			phoneNumber: candidates.phoneNumber,
			website: candidates.website,
			linkedIn: candidates.linkedIn,
			gitHub: candidates.gitHub,
		})
		.from(candidates)
		.where(eq(candidates.candidateId, candidateId))
		.limit(1)

	return candidate ?? null
}

// Update candidate by candidate ID.
export async function updateCandidateByCandidateId(
	candidateId: string,
	candidatePatch: CandidatePatch,
) {
	// Update candidate.
	const [updatedCandidate] = await db
		.update(candidates)
		.set({ ...candidatePatch, updatedAt: new Date() })
		.where(eq(candidates.candidateId, candidateId))
		.returning({
			candidateId: candidates.candidateId,
			firstName: candidates.firstName,
			middleName: candidates.middleName,
			lastName: candidates.lastName,
			who: candidates.who,
			email: candidates.email,
			phoneCountryCode: candidates.phoneCountryCode,
			phoneNumber: candidates.phoneNumber,
			website: candidates.website,
			linkedIn: candidates.linkedIn,
			gitHub: candidates.gitHub,
		})

	return updatedCandidate ?? null
}
