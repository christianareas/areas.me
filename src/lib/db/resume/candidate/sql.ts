// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { eq } from "drizzle-orm"
import type { CandidateUpdate } from "@/lib/api/schemas/resume/candidate/contract"
import { db } from "@/lib/db"
import { candidates } from "@/lib/db/schema"

// --------------------------------------------------------------------------------
// Fields.
// --------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------
// Candidate.
// --------------------------------------------------------------------------------

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

export async function findCandidateByCandidateId(candidateId: string) {
	// Select candidate.
	const [candidate] = await db
		.select(candidateFields)
		.from(candidates)
		.where(eq(candidates.candidateId, candidateId))
		.limit(1)

	return candidate ?? null
}

export async function updateCandidateByCandidateId(
	candidateId: string,
	candidateUpdate: CandidateUpdate,
) {
	// Update candidate.
	const [updatedCandidate] = await db
		.update(candidates)
		.set({ ...candidateUpdate, updatedAt: new Date() })
		.where(eq(candidates.candidateId, candidateId))
		.returning({
			...candidateFields,
			updatedAt: candidates.updatedAt,
		})

	return updatedCandidate ?? null
}

// --------------------------------------------------------------------------------
