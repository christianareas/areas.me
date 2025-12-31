// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { getSkillByCandidateIdSkillSetIdAndSkillId } from "@/lib/db/resume/skillSets/skill"

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

	// Candidate, skill set, and skill.
	const skillLookup = await getSkillByCandidateIdSkillSetIdAndSkillId(
		candidateId,
		skillSetId,
		skillId,
	)

	// Validate the candidate found.
	if (!skillLookup) {
		return validateDataFound(null, "candidate", { candidateId }) as NextResponse
	}

	// Validate the skill set found.
	if (!skillLookup.skillSetId) {
		return validateDataFound(null, "skill set", {
			candidateId,
			skillSetId,
		}) as NextResponse
	}

	// Validate the skill found.
	if (!skillLookup.skillId) {
		return validateDataFound(null, "skill", {
			candidateId,
			skillSetId,
			skillId,
		}) as NextResponse
	}

	return NextResponse.json({ skill: skillLookup }, { status: 200 })
}
