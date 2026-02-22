// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { roleCreateSchema } from "@/lib/api/schemas/resume/experience/contract"
import {
	catchServerError,
	parseJson,
	validateDataCreated,
	validateDataFound,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	createRoleByCandidateId,
	findRolesByCandidateId,
} from "@/lib/db/resume/experience/sql"

// --------------------------------------------------------------------------------
// POST /api/resume/[candidateId]/experience.
// --------------------------------------------------------------------------------

export async function POST(
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
	const validatedRequestBodyOrErrorResponse = validateRequestBodyAgainstSchema(
		requestBody,
		roleCreateSchema,
	)
	if (validatedRequestBodyOrErrorResponse instanceof NextResponse)
		return validatedRequestBodyOrErrorResponse

	// Validated request body.
	const validatedRequestBody = validatedRequestBodyOrErrorResponse

	try {
		// Found candidate.
		const foundCandidate = await findCandidateByCandidateId(candidateId)

		// If the candidate’s not found, return 404.
		const candidateErrorResponse = validateDataFound(
			foundCandidate,
			"candidate",
			{ candidateId },
		)
		if (candidateErrorResponse) return candidateErrorResponse

		// Created role.
		const createdRole = await createRoleByCandidateId(
			candidateId,
			validatedRequestBody,
		)

		// If the role’s not created, return 500.
		const createErrorResponse = validateDataCreated(createdRole, "role", {
			candidateId,
		})
		if (createErrorResponse) return createErrorResponse

		// If the role’s created, return 201.
		return NextResponse.json({ role: createdRole }, { status: 201 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId]/experience.
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
		// Found candidate.
		const foundCandidate = await findCandidateByCandidateId(candidateId)

		// If the candidate’s not found, return 404.
		const candidateErrorResponse = validateDataFound(
			foundCandidate,
			"candidate",
			{ candidateId },
		)
		if (candidateErrorResponse) return candidateErrorResponse

		// Experience.
		const experience = await findRolesByCandidateId(candidateId)

		// If the experience’s found, return 200.
		return NextResponse.json({ experience }, { status: 200 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
