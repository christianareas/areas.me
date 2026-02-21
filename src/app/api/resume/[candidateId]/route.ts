// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId].
// --------------------------------------------------------------------------------

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// If the candidate ID isn’t a valid UUID, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId])
	if (uuidFormatErrorResponse) return uuidFormatErrorResponse

	// Found resume.
	const foundResume = await findResumeByCandidateId(candidateId)

	// If the resume isn’t found, return 404.
	const resumeErrorResponse = validateDataFound(foundResume, "resume", {
		candidateId,
	})
	if (resumeErrorResponse) return resumeErrorResponse

	// If the resume’s found, return 200.
	return NextResponse.json({ resume: foundResume }, { status: 200 })
}

// --------------------------------------------------------------------------------
// PUT /api/resume/[candidateId].
// --------------------------------------------------------------------------------

export async function PUT(
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

	// If parsing the request body fails, return 400.
	const requestBodyOrErrorResponse = await parseJson(request)
	if (requestBodyOrErrorResponse instanceof NextResponse)
		return requestBodyOrErrorResponse

	// Request body.
	const requestBody = requestBodyOrErrorResponse

	// If validating the request body against the schema fails, return 400.
	const requestBodyValidationErrorResponse = validateRequestBodyAgainstSchema(
		requestBody,
		resumePutSchema,
	)
	if (requestBodyValidationErrorResponse instanceof NextResponse)
		return requestBodyValidationErrorResponse

	// Replaced resume.
	const replacedResume = await replaceResumeByCandidateId(candidateId)

	// If the resume isn’t found, return 404.
	const resumeErrorResponse = validateDataFound(replacedResume, "resume", {
		candidateId,
	})
	if (resumeErrorResponse) return resumeErrorResponse

	// If the resume’s replaced, return 200.
	return NextResponse.json({ resume: replacedResume }, { status: 200 })
}

// --------------------------------------------------------------------------------
// DELETE /api/resume/[candidateId].
// --------------------------------------------------------------------------------

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

	// Deleted resume.
	const deletedResume = await deleteResumeByCandidateId(candidateId)

	// If the resume isn’t found, return 404.
	const resumeErrorResponse = validateDataFound(deletedResume, "resume", {
		candidateId,
	})
	if (resumeErrorResponse) return resumeErrorResponse

	// If the resume’s deleted, return 204.
	return new NextResponse(null, { status: 204 })
}

// --------------------------------------------------------------------------------
