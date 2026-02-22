// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { skillSetUpdateSchema } from "@/lib/api/schemas/resume/skillSets/contract"
import {
	catchServerError,
	parseJson,
	validateDataFound,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	deleteSkillSetByCandidateIdAndSkillSetId,
	findSkillSetByCandidateIdAndSkillSetId,
	updateSkillSetByCandidateIdAndSkillSetId,
} from "@/lib/db/resume/skillSets/sql"

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId]/skillSets/[skillSetId].
// --------------------------------------------------------------------------------

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; skillSetId: string }> },
) {
	// Candidate and skill set IDs.
	const { candidateId, skillSetId } = await params

	// If the candidate and skill set IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId, skillSetId])
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

		// Found skill set.
		const foundSkillSet = await findSkillSetByCandidateIdAndSkillSetId(
			candidateId,
			skillSetId,
		)

		// If the skill set’s not found, return 404.
		const skillSetErrorResponse = validateDataFound(
			foundSkillSet,
			"skill set",
			{
				skillSetId,
			},
		)
		if (skillSetErrorResponse) return skillSetErrorResponse

		// If the skill set’s found, return 200.
		return NextResponse.json({ skillSet: foundSkillSet }, { status: 200 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
// PATCH /api/resume/[candidateId]/skillSets/[skillSetId].
// --------------------------------------------------------------------------------

export async function PATCH(
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

	// If parsing the request body fails, return 400.
	const requestBodyOrErrorResponse = await parseJson(request)
	if (requestBodyOrErrorResponse instanceof NextResponse)
		return requestBodyOrErrorResponse

	// Request body.
	const requestBody = requestBodyOrErrorResponse

	// If validating the request body against the schema fails, return 400.
	const validatedRequestBodyOrErrorResponse = validateRequestBodyAgainstSchema(
		requestBody,
		skillSetUpdateSchema,
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

		// Updated skill set.
		const updatedSkillSet = await updateSkillSetByCandidateIdAndSkillSetId(
			candidateId,
			skillSetId,
			validatedRequestBody,
		)

		// If the skill set’s not found, return 404.
		const skillSetErrorResponse = validateDataFound(
			updatedSkillSet,
			"skill set",
			{ skillSetId },
		)
		if (skillSetErrorResponse) return skillSetErrorResponse

		// If the skill set’s found and updated, return 200.
		return NextResponse.json({ skillSet: updatedSkillSet }, { status: 200 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
// DELETE /api/resume/[candidateId]/skillSets/[skillSetId].
// --------------------------------------------------------------------------------

export async function DELETE(
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

		// Deleted skill set.
		const deletedSkillSet = await deleteSkillSetByCandidateIdAndSkillSetId(
			candidateId,
			skillSetId,
		)

		// If the skill set’s not found, return 404.
		const skillSetErrorResponse = validateDataFound(
			deletedSkillSet,
			"skill set",
			{ skillSetId },
		)
		if (skillSetErrorResponse) return skillSetErrorResponse

		// If the skill set’s found and deleted, return 204.
		return new NextResponse(null, { status: 204 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
