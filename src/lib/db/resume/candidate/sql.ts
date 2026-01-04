// Dependencies.
import { eq } from "drizzle-orm"
import type { CandidatePatch } from "@/lib/api/schemas/resume/candidate/contract"
import { db } from "@/lib/db"
import { candidates } from "@/lib/db/schema"

// Candidate fields.
const candidateFields = {
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
}

// Find first candidate ID.
export async function findFirstCandidateId() {
	// Select candidate.
	const [candidate] = await db
		.select({
			candidateId: candidates.candidateId,
		})
		.from(candidates)
		.orderBy(candidates.createdAt)
		.limit(1)

	return candidate?.candidateId ?? null
}

// Find candidate by candidate ID.
export async function findCandidateByCandidateId(candidateId: string) {
	// Select candidate.
	const [candidate] = await db
		.select(candidateFields)
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
			...candidateFields,
			updatedAt: candidates.updatedAt,
		})

	return updatedCandidate ?? null
}

// Delete candidate by candidate ID.
export async function deleteCandidateByCandidateId(candidateId: string) {
	// Delete candidate.
	const [deletedCandidate] = await db
		.delete(candidates)
		.where(eq(candidates.candidateId, candidateId))
		.returning({ candidateId: candidates.candidateId })

	return deletedCandidate ?? null
}
