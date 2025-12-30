// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { candidatePatchSchema } from "@/lib/api/schemas/candidate"
import {
	parseJson,
	validateDataFoundByCandidateId,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import { getCandidateById, updateCandidateById } from "@/lib/db/candidate"

//
// GET /api/resume/[candidateId]/candidate.
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
	const candidate = await getCandidateById(candidateId)

	// Validate the candidate found.
	const candidateValidationResponse = validateDataFoundByCandidateId(
		candidateId,
		candidate,
		"candidate",
	)
	if (candidateValidationResponse) return candidateValidationResponse

	return NextResponse.json({ candidate }, { status: 200 })
}

//
// PATCH /api/resume/[candidateId]/candidate.
//
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// Validate the candidate ID is a valid UUID.
	const uuidFormatValidationResponse = validateUuidFormat(candidateId)
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Parse the request body JSON.
	const requestBodyOrResponse = await parseJson(request)
	if (requestBodyOrResponse instanceof NextResponse)
		return requestBodyOrResponse

	// Request body.
	const requestBody = requestBodyOrResponse

	// Validate the request body against the schema.
	const candidatePatchOrResponse = validateRequestBodyAgainstSchema(
		requestBody,
		candidatePatchSchema,
	)
	if (candidatePatchOrResponse instanceof NextResponse)
		return candidatePatchOrResponse

	// Candidate patch.
	const candidatePatch = candidatePatchOrResponse

	// Updated candidate.
	const updatedCandidate = await updateCandidateById(
		candidateId,
		candidatePatch,
	)

	// Validate the candidate found.
	const candidateValidationResponse = validateDataFoundByCandidateId(
		candidateId,
		updatedCandidate,
		"candidate",
	)
	if (candidateValidationResponse) return candidateValidationResponse

	return NextResponse.json({ candidate: updatedCandidate }, { status: 200 })
}
