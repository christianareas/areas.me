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

	// Found education.
	const foundEducation = await findEducationByCandidateId(candidateId)

	// If the education’s not found, return 404.
	const educationErrorResponse = validateDataFound(
		foundEducation,
		"education",
		{ candidateId },
	)
	if (educationErrorResponse) return educationErrorResponse

	// If the education’s found, return 200.
	return NextResponse.json({ education: foundEducation }, { status: 200 })
}
