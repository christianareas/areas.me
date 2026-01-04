// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findResumeByCandidateId } from "@/lib/db/resume/sql"

//
// GET /api/resume/[candidateId].
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

	// Resume.
	const resume = await findResumeByCandidateId(candidateId)

	// Validate the resume found.
	const resumeValidationResponse = validateDataFound(resume, "resume", {
		candidateId,
	})
	if (resumeValidationResponse) return resumeValidationResponse

	return NextResponse.json({ resume }, { status: 200 })
}
