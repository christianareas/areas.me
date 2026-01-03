// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { getCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { getSkillSetByCandidateIdAndSkillSetId } from "@/lib/db/resume/skillSets/skillSet/sql"

//
// GET /api/resume/[candidateId]/skillSets/[skillSetId].
//
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; skillSetId: string }> },
) {
	// Candidate and skill set IDs.
	const { candidateId, skillSetId } = await params

	// Validate the candidate and skill set IDs are valid UUIDs.
	const uuidFormatValidationResponse = validateUuidFormat([
		candidateId,
		skillSetId,
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

	return NextResponse.json({ skillSet }, { status: 200 })
}
