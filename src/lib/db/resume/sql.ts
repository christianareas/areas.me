// Dependencies.
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findEducationByCandidateId } from "@/lib/db/resume/education/sql"
import { findRolesByCandidateId } from "@/lib/db/resume/experience/sql"
import { findSkillSetsByCandidateId } from "@/lib/db/resume/skillSets/sql"
import { candidates } from "@/lib/db/schema"

// Find resume by candidate ID.
export async function findResumeByCandidateId(candidateId: string) {
	// Candidate.
	const candidate = await findCandidateByCandidateId(candidateId)

	// If there's no candidate, return null.
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

// Replace resume by candidate ID.
export async function replaceResumeByCandidateId(candidateId: string) {
	// Stub.
	return { candidate: { candidateId } }
}

// Delete resume by candidate ID.
export async function deleteResumeByCandidateId(candidateId: string) {
	// Delete candidate.
	const [deletedCandidate] = await db
		.delete(candidates)
		.where(eq(candidates.candidateId, candidateId))
		.returning({ candidateId: candidates.candidateId })

	return deletedCandidate ?? null
}
