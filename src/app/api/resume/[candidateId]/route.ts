// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import {
	catchServerError,
	validateDataFound,
	validateUuidFormat,
} from "@/lib/api/validate"
import {
	deleteResumeByCandidateId,
	findResumeByCandidateId,
} from "@/lib/db/resume/sql"

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId].
// --------------------------------------------------------------------------------

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// If the candidate ID isn’t a valid UUID, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId])
	if (uuidFormatErrorResponse) return uuidFormatErrorResponse

	try {
		// Found resume.
		const foundResume = await findResumeByCandidateId(candidateId)

		// If the resume isn’t found, return 404.
		const resumeErrorResponse = validateDataFound(foundResume, "resume", {
			candidateId,
		})
		if (resumeErrorResponse) return resumeErrorResponse

		// If the resume’s found, return 200.
		return NextResponse.json({ resume: foundResume }, { status: 200 })
	} catch (error) {
		return catchServerError(error, request)
	}
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

	try {
		// Deleted resume.
		const deletedResume = await deleteResumeByCandidateId(candidateId)

		// If the resume isn’t found, return 404.
		const resumeErrorResponse = validateDataFound(deletedResume, "resume", {
			candidateId,
		})
		if (resumeErrorResponse) return resumeErrorResponse

		// If the resume’s deleted, return 204.
		return new NextResponse(null, { status: 204 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
