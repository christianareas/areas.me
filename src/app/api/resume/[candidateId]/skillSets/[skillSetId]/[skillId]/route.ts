// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateCandidateId, validateResumeItem } from "@/lib/api/resume"
import { resume } from "@/lib/db/resume"

// GET request.
export async function GET(
	_request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			candidateId: string
			skillSetId: string
			skillId: string
		}>
	},
) {
	// Candidate, skill set, skill IDs.
	const { candidateId, skillSetId, skillId } = await params

	// Validate candidate ID.
	const candidateIdError = validateCandidateId(candidateId)
	if (candidateIdError) return candidateIdError

	// Skill set.
	const skillSet = resume.skillSets?.find(
		(skillSet) => skillSet.skillSetId === skillSetId,
	)

	// Validate skill set.
	const skillSetError = validateResumeItem(
		skillSet,
		"skillSet",
		skillSetId,
		"skillSetId",
	)
	if (skillSetError) return skillSetError

	// Skill.
	const skill = skillSet?.skills?.find((skill) => skill.skillId === skillId)

	// Validate skill.
	const skillError = validateResumeItem(skill, "skill", skillId, "skillId")
	if (skillError) return skillError

	return NextResponse.json({ skill }, { status: 200 })
}
