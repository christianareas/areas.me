// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { resumePutSchema } from "@/lib/api/schemas/resume/contract"
import {
	parseJson,
	validateDataFound,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import {
	deleteResumeByCandidateId,
	findResumeByCandidateId,
	replaceResumeByCandidateId,
} from "@/lib/db/resume/sql"

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

//
// PUT /api/resume/[candidateId].
//
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// Validate the candidate ID is a valid UUID.
	const uuidFormatValidationResponse = validateUuidFormat(candidateId)
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Authorize the API token.
	const authorizationResponse = await authorizeApiToken(request, {
		candidateId,
		scopeRequirement: "resume:write",
	})
	if (authorizationResponse) return authorizationResponse

	// Parse the request body JSON.
	const requestBodyOrResponse = await parseJson(request)
	if (requestBodyOrResponse instanceof NextResponse)
		return requestBodyOrResponse

	// Request body.
	const requestBody = requestBodyOrResponse

	// Validate the request body against the schema.
	const resumePutOrResponse = validateRequestBodyAgainstSchema(
		requestBody,
		resumePutSchema,
	)
	if (resumePutOrResponse instanceof NextResponse) return resumePutOrResponse

	// Replaced resume.
	const replacedResume = await replaceResumeByCandidateId(candidateId)

	// Validate the resume found.
	const resumeValidationResponse = validateDataFound(replacedResume, "resume", {
		candidateId,
	})
	if (resumeValidationResponse) return resumeValidationResponse

	return NextResponse.json({ resume: replacedResume }, { status: 200 })
}

//
// DELETE /api/resume/[candidateId].
//
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// Validate the candidate ID is a valid UUID.
	const uuidFormatValidationResponse = validateUuidFormat(candidateId)
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Authorize the API token.
	const authorizationResponse = await authorizeApiToken(request, {
		candidateId,
		scopeRequirement: "resume:write",
	})
	if (authorizationResponse) return authorizationResponse

	// Deleted resume.
	const deletedResume = await deleteResumeByCandidateId(candidateId)

	// Validate the resume found.
	const resumeValidationResponse = validateDataFound(deletedResume, "resume", {
		candidateId,
	})
	if (resumeValidationResponse) return resumeValidationResponse

	return new NextResponse(null, { status: 204 })
}
