// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import {
	parseRequestBody,
	validateDataFoundByCandidateId,
	validateUuidFormat,
} from "@/lib/api/resume"
import { candidatePatchSchema } from "@/lib/api/schemas/candidate"
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

	// Parse the request body.
	const requestBodyOrResponse = await parseRequestBody(request)
	if (requestBodyOrResponse instanceof NextResponse) {
		return requestBodyOrResponse
	}
	const requestBody = requestBodyOrResponse

	// Validate the request body against the schema.
	const parsedRequestBody = candidatePatchSchema.safeParse(requestBody)

	if (!parsedRequestBody.success) {
		const issues = parsedRequestBody.error.issues.map((issue) => {
			if (issue.code === "unrecognized_keys") {
				return {
					path: "",
					message: `The schema doesn't allow these fields: ${issue.keys.join(", ")}.`,
				}
			}

			return {
				path: issue.path.join("."),
				message: issue.message,
			}
		})

		return NextResponse.json(
			{ error: "The request body doesn’t match the schema.", issues },
			{ status: 400 },
		)
	}

	// Candidate patch.
	const candidatePatch = parsedRequestBody.data

	// Updated candidate.
	const updatedCandidate = await updateCandidateById(
		candidateId,
		candidatePatch,
	)

	if (!updatedCandidate) {
		return NextResponse.json(
			{
				error: `Couldn’t find the candidate by candidateId (${candidateId}).`,
			},
			{ status: 404 },
		)
	}

	return NextResponse.json({ candidate: updatedCandidate }, { status: 200 })
}
