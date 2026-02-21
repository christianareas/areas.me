// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findRolesByCandidateId } from "@/lib/db/resume/experience/sql"

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId]/experience.
// --------------------------------------------------------------------------------

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// If the candidate ID isn’t a valid UUID, return 400.
	const uuidFormatValidationResponse = validateUuidFormat(candidateId)
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Candidate.
	const candidate = await findCandidateByCandidateId(candidateId)

	// If the candidate’s not found, return 404.
	const candidateValidationResponse = validateDataFound(
		candidate,
		"candidate",
		{ candidateId },
	)
	if (candidateValidationResponse) return candidateValidationResponse

	// Experience.
	const experience = await findRolesByCandidateId(candidateId)

	// If the experience’s found, return 200.
	return NextResponse.json({ experience }, { status: 200 })
}

// --------------------------------------------------------------------------------
