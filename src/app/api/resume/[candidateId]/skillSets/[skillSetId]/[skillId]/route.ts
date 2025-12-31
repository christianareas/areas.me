// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { getCandidateByCandidateId } from "@/lib/db/resume/candidate"
import { getSkillByCandidateIdSkillSetIdAndSkillId } from "@/lib/db/resume/skillSets/skill"
import { getSkillSetByCandidateIdAndSkillSetId } from "@/lib/db/resume/skillSets/skillSet"

//
// GET /api/resume/[candidateId]/skillSets/[skillSetId]/[skillId].
//
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

	// Validate the candidate, skill set, and skill IDs are valid UUIDs.
	const uuidFormatValidationResponse = validateUuidFormat([
		candidateId,
		skillSetId,
		skillId,
	])
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Candidate.
	const candidate = await getCandidateByCandidateId(candidateId)

	// Validate the candidate found.
	const candidateValidationResponse = validateDataFound(
		candidate,
		"candidate",
		{ candidateId },
	)
	if (candidateValidationResponse) return candidateValidationResponse

	// Skill set.
	const skillSet = await getSkillSetByCandidateIdAndSkillSetId(
		candidateId,
		skillSetId,
	)

	// Validate the skill set found.
	const skillSetValidationResponse = validateDataFound(skillSet, "skill set", {
		candidateId,
		skillSetId,
	})
	if (skillSetValidationResponse) return skillSetValidationResponse

	// Skill.
	const skill = await getSkillByCandidateIdSkillSetIdAndSkillId(
		candidateId,
		skillSetId,
		skillId,
	)

	// Validate the skill found.
	const skillValidationResponse = validateDataFound(skill, "skill", {
		candidateId,
		skillSetId,
		skillId,
	})
	if (skillValidationResponse) return skillValidationResponse

	return NextResponse.json({ skill }, { status: 200 })
}
