// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findSkillSetsByCandidateId } from "@/lib/db/resume/skillSets/sql"

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId]/skillSets.
// --------------------------------------------------------------------------------

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// If the candidate ID isn’t a valid UUID, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId])
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

	// Skill sets.
	const skillSets = await findSkillSetsByCandidateId(candidateId)

	// If the skill sets are found, return 200.
	return NextResponse.json({ skillSets }, { status: 200 })
}

// --------------------------------------------------------------------------------
