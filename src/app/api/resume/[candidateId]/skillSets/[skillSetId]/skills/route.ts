// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { skillCreateSchema } from "@/lib/api/schemas/resume/skillSets/contract"
import {
	parseJson,
	validateDataCreated,
	validateDataFound,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	createSkillByCandidateIdAndSkillSetId,
	findSkillSetByCandidateIdAndSkillSetId,
} from "@/lib/db/resume/skillSets/sql"

// --------------------------------------------------------------------------------
// POST /api/resume/[candidateId]/skillSets/[skillSetId]/skills.
// --------------------------------------------------------------------------------

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; skillSetId: string }> },
) {
	// Candidate and skill set IDs.
	const { candidateId, skillSetId } = await params

	// If the candidate and skill set IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId, skillSetId])
	if (uuidFormatErrorResponse) return uuidFormatErrorResponse

	// If authorization fails, return 401, 403, or 404.
	const authorizationErrorResponse = await authorizeApiToken(request, {
		candidateId,
		scopeRequirement: "resume:write",
	})
	if (authorizationErrorResponse) return authorizationErrorResponse

	// Found candidate.
	const foundCandidate = await findCandidateByCandidateId(candidateId)

	// If the candidate’s not found, return 404.
	const candidateErrorResponse = validateDataFound(
		foundCandidate,
		"candidate",
		{ candidateId },
	)
	if (candidateErrorResponse) return candidateErrorResponse

	// Found skill set.
	const foundSkillSet = await findSkillSetByCandidateIdAndSkillSetId(
		candidateId,
		skillSetId,
	)

	// If the skill set’s not found, return 404.
	const skillSetErrorResponse = validateDataFound(foundSkillSet, "skill set", {
		skillSetId,
	})
	if (skillSetErrorResponse) return skillSetErrorResponse

	// If parsing the request body fails, return 400.
	const requestBodyOrErrorResponse = await parseJson(request)
	if (requestBodyOrErrorResponse instanceof NextResponse)
		return requestBodyOrErrorResponse

	// Request body.
	const requestBody = requestBodyOrErrorResponse

	// If validating the request body against the schema fails, return 400.
	const validatedRequestBodyOrErrorResponse = validateRequestBodyAgainstSchema(
		requestBody,
		skillCreateSchema,
	)
	if (validatedRequestBodyOrErrorResponse instanceof NextResponse)
		return validatedRequestBodyOrErrorResponse

	// Validated request body.
	const validatedRequestBody = validatedRequestBodyOrErrorResponse

	// Created skill.
	const createdSkill = await createSkillByCandidateIdAndSkillSetId(
		candidateId,
		skillSetId,
		validatedRequestBody,
	)

	// If the skill’s not created, return 500.
	const createErrorResponse = validateDataCreated(createdSkill, "skill", {
		candidateId,
		skillSetId,
	})
	if (createErrorResponse) return createErrorResponse

	// If the skill’s created, return 201.
	return NextResponse.json({ skill: createdSkill }, { status: 201 })
}

// --------------------------------------------------------------------------------
