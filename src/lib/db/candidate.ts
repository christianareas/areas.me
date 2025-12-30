// Dependencies.
import { eq } from "drizzle-orm"
import type { CandidatePatch } from "@/lib/api/schemas/candidate"
import { db } from "@/lib/db"
import { candidates } from "@/lib/db/schema"

// Get candidate by ID.
export async function getCandidateByCandidateId(candidateId: string) {
	const [candidate] = await db
		.select()
		.from(candidates)
		.where(eq(candidates.candidateId, candidateId))
		.limit(1)

	return candidate ?? null
}

// Update candidate by ID.
export async function updateCandidateByCandidateId(
	candidateId: string,
	candidatePatch: CandidatePatch,
) {
	const [updatedCandidate] = await db
		.update(candidates)
		.set({ ...candidatePatch, updatedAt: new Date() })
		.where(eq(candidates.candidateId, candidateId))
		.returning()

	return updatedCandidate ?? null
}
