// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findEducationByCandidateId } from "@/lib/db/resume/education/sql"

//
// GET /api/resume/[candidateId]/education.
//
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// Validate the candidate ID is a valid UUID.
	const uuidFormatValidationResponse = validateUuidFormat(candidateId)
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Candidate.
	const candidate = await findCandidateByCandidateId(candidateId)

	// Validate the candidate found.
	const candidateValidationResponse = validateDataFound(
		candidate,
		"candidate",
		{ candidateId },
	)
	if (candidateValidationResponse) return candidateValidationResponse

	// Education.
	const education = await findEducationByCandidateId(candidateId)

	return NextResponse.json({ education }, { status: 200 })
}
