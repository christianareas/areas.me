// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import {
	validateDataFoundByCandidateId,
	validateUuidFormat,
} from "@/lib/api/validate"
import { getCandidateByCandidateId } from "@/lib/db/candidate"

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

	// Education.
	const education = await getCandidateByCandidateId(candidateId)

	// Validate the education found.
	const educationValidationResponse = validateDataFoundByCandidateId(
		candidateId,
		education,
		"education",
	)
	if (educationValidationResponse) return educationValidationResponse

	return NextResponse.json({ education }, { status: 200 })
}
