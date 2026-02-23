// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"
import type { ResumeCreate } from "@/lib/api/schemas/resume/contract"
import { db } from "@/lib/db"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findEducationByCandidateId } from "@/lib/db/resume/education/sql"
import { findRolesByCandidateId } from "@/lib/db/resume/experience/sql"
import { findSkillSetsByCandidateId } from "@/lib/db/resume/skillSets/sql"
import { candidates } from "@/lib/db/schema"

// --------------------------------------------------------------------------------
// Find resume by candidate ID.
// --------------------------------------------------------------------------------

export async function findResumeByCandidateId(candidateId: string) {
	// Candidate.
	const candidate = await findCandidateByCandidateId(candidateId)

	// If the candidate isn’t found, return null.
	if (!candidate) return null

	// Resume.
	const [experience, skillSets, education] = await Promise.all([
		findRolesByCandidateId(candidateId),
		findSkillSetsByCandidateId(candidateId),
		findEducationByCandidateId(candidateId),
	])

	return {
		candidate,
		experience,
		skillSets,
		education,
	}
}

// --------------------------------------------------------------------------------
// Create resume.
// --------------------------------------------------------------------------------

export async function createResume(resumeCreate: ResumeCreate) {
	const candidateId = randomUUID()

	// Insert candidate.
	const [newCandidate] = await db
		.insert(candidates)
		.values({
			candidateId,
			...resumeCreate.candidate,
		})
		.returning({
			candidateId: candidates.candidateId,
		})

	if (!newCandidate) return null

	// Found resume.
	const foundResume = await findResumeByCandidateId(newCandidate.candidateId)

	return foundResume ?? null
}

// --------------------------------------------------------------------------------
// Delete resume by candidate ID.
// --------------------------------------------------------------------------------

export async function deleteResumeByCandidateId(candidateId: string) {
	// Delete candidate.
	const [deletedCandidate] = await db
		.delete(candidates)
		.where(eq(candidates.candidateId, candidateId))
		.returning({ candidateId: candidates.candidateId })

	return deletedCandidate ?? null
}

// --------------------------------------------------------------------------------
