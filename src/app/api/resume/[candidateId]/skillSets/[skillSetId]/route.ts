// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findSkillSetByCandidateIdAndSkillSetId } from "@/lib/db/resume/skillSets/sql"

//
// GET /api/resume/[candidateId]/skillSets/[skillSetId].
//
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; skillSetId: string }> },
) {
	// Candidate and skill set IDs.
	const { candidateId, skillSetId } = await params

	// If the candidate and skill set IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId, skillSetId])
	if (uuidFormatErrorResponse) return uuidFormatErrorResponse

	// Found candidate.
	const foundCandidate = await findCandidateByCandidateId(candidateId)

	// If the candidate’s not found, return 404.
	const candidateErrorResponse = validateDataFound(
		foundCandidate,
		"candidate",
		{ candidateId },
	)
	if (candidateErrorResponse) return candidateErrorResponse

	// Found skill set.
	const foundSkillSet = await findSkillSetByCandidateIdAndSkillSetId(
		candidateId,
		skillSetId,
	)

	// If the skill set’s not found, return 404.
	const skillSetErrorResponse = validateDataFound(foundSkillSet, "skill set", {
		skillSetId,
	})
	if (skillSetErrorResponse) return skillSetErrorResponse

	// If the skill set’s found, return 200.
	return NextResponse.json({ skillSet: foundSkillSet }, { status: 200 })
}
