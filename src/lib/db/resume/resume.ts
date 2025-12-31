// Dependencies.
import { getCandidateByCandidateId } from "@/lib/db/resume/candidate/candidate"
import { getEducationByCandidateId } from "@/lib/db/resume/education/education"
import { getExperienceByCandidateId } from "@/lib/db/resume/experience/experience"
import { getSkillSetsByCandidateId } from "@/lib/db/resume/skillSets/skillSets"

// Get resume by candidate ID.
export async function getResumeByCandidateId(candidateId: string) {
	// Candidate.
	const candidate = await getCandidateByCandidateId(candidateId)

	// If there's no candidate, return null.
	if (!candidate) return null

	// Resume sections.
	const [experience, skillSets, education] = await Promise.all([
		getExperienceByCandidateId(candidateId),
		getSkillSetsByCandidateId(candidateId),
		getEducationByCandidateId(candidateId),
	])

	return {
		candidate,
		experience,
		skillSets,
		education,
	}
}
