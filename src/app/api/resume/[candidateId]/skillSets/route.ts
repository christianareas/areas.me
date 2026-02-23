// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { skillSetCreateSchema } from "@/lib/api/schemas/resume/skillSets/contract"
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
	createSkillSetByCandidateId,
	findSkillSetsByCandidateId,
} from "@/lib/db/resume/skillSets/sql"

// --------------------------------------------------------------------------------
// POST /api/resume/[candidateId]/skillSets.
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
		skillSetCreateSchema,
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

		// Created skill set.
		const createdSkillSet = await createSkillSetByCandidateId(
			candidateId,
			validatedRequestBody,
		)

		// If the skill set’s not created, return 500.
		const createErrorResponse = validateDataCreated(
			createdSkillSet,
			"skill set",
			{ candidateId },
		)
		if (createErrorResponse) return createErrorResponse

		// If the skill set’s created, return 201.
		return NextResponse.json({ skillSet: createdSkillSet }, { status: 201 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId]/skillSets.
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

		// Skill sets.
		const skillSets = await findSkillSetsByCandidateId(candidateId)

		// If the skill sets are found, return 200.
		return NextResponse.json({ skillSets }, { status: 200 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
