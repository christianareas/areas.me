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

	// If the candidate ID is not a valid UUID, return 400 Bad Request.
	const uuidFormatBadRequestResponse = validateUuidFormat(candidateId)
	if (uuidFormatBadRequestResponse) return uuidFormatBadRequestResponse

	// Resume.
	const resume = await findResumeByCandidateId(candidateId)

	// If there's no resume, return 404 Not Found.
	const resumeNotFoundResponse = validateDataFound(resume, "resume", {
		candidateId,
	})
	if (resumeNotFoundResponse) return resumeNotFoundResponse

	// If there's a resume, return 200 OK.
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

	// If the candidate ID is not a valid UUID, return 400 Bad Request.
	const uuidFormatBadRequestResponse = validateUuidFormat(candidateId)
	if (uuidFormatBadRequestResponse) return uuidFormatBadRequestResponse

	// If authorization fails, return 401 Unauthorized, 403 Forbidden, or 404 Not Found.
	const authorizationErrorResponse = await authorizeApiToken(request, {
		candidateId,
		scopeRequirement: "resume:write",
	})
	if (authorizationErrorResponse) return authorizationErrorResponse

	// If parsing the request body fails, return 400 Bad Request.
	const requestBodyOrResponse = await parseJson(request)
	if (requestBodyOrResponse instanceof NextResponse)
		return requestBodyOrResponse

	// Request body.
	const requestBody = requestBodyOrResponse

	// If validating the request body against the schema fails, return 400 Bad Request.
	const resumeReplaceBadRequestResponse = validateRequestBodyAgainstSchema(
		requestBody,
		resumePutSchema,
	)
	if (resumeReplaceBadRequestResponse instanceof NextResponse)
		return resumeReplaceBadRequestResponse

	// Replaced resume.
	const replacedResume = await replaceResumeByCandidateId(candidateId)

	// If resume replacement fails, return 404 Not Found.
	const resumeNotFoundResponse = validateDataFound(replacedResume, "resume", {
		candidateId,
	})
	if (resumeNotFoundResponse) return resumeNotFoundResponse

	// If resume replacement succeeds, return 200 OK.
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

	// If the candidate ID is not a valid UUID, return 400 Bad Request.
	const uuidFormatBadRequestResponse = validateUuidFormat(candidateId)
	if (uuidFormatBadRequestResponse) return uuidFormatBadRequestResponse

	// If authorization fails, return 401 Unauthorized, 403 Forbidden, or 404 Not Found.
	const authorizationErrorResponse = await authorizeApiToken(request, {
		candidateId,
		scopeRequirement: "resume:write",
	})
	if (authorizationErrorResponse) return authorizationErrorResponse

	// Deleted resume.
	const deletedResume = await deleteResumeByCandidateId(candidateId)

	// If resume deletion fails, return 404 Not Found.
	const resumeNotFoundResponse = validateDataFound(deletedResume, "resume", {
		candidateId,
	})
	if (resumeNotFoundResponse) return resumeNotFoundResponse

	// If resume deletion succeeds, return 204 No Content.
	return new NextResponse(null, { status: 204 })
}
