// Dependencies.
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findEducationByCandidateId } from "@/lib/db/resume/education/sql"
import { findExperienceByCandidateId } from "@/lib/db/resume/experience/sql"
import { findSkillSetsByCandidateId } from "@/lib/db/resume/skillSets/sql"

// Find resume by candidate ID.
export async function findResumeByCandidateId(candidateId: string) {
	// Candidate.
	const candidate = await findCandidateByCandidateId(candidateId)

	// If there's no candidate, return null.
	if (!candidate) return null

	// Resume.
	const [experience, skillSets, education] = await Promise.all([
		findExperienceByCandidateId(candidateId),
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
