// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	deleteEducationByCandidateId,
	findEducationByCandidateId,
} from "@/lib/db/resume/education/sql"

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

//
// DELETE /api/resume/[candidateId]/education.
//
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// If the candidate ID isn’t a valid UUID, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId])
	if (uuidFormatErrorResponse) return uuidFormatErrorResponse

	// If authorization fails, return 401, 403, or 404.
	const authorizationErrorResponse = await authorizeApiToken(request, {
		candidateId,
		scopeRequirement: "resume:write",
	})
	if (authorizationErrorResponse) return authorizationErrorResponse

	// Found candidate.
	const foundCandidate = await findCandidateByCandidateId(candidateId)

	// If the candidate’s not found, return 404.
	const candidateErrorResponse = validateDataFound(
		foundCandidate,
		"candidate",
		{ candidateId },
	)
	if (candidateErrorResponse) return candidateErrorResponse

	// Deleted education.
	await deleteEducationByCandidateId(candidateId)

	// If the education’s deleted, return 204.
	return new NextResponse(null, { status: 204 })
}
