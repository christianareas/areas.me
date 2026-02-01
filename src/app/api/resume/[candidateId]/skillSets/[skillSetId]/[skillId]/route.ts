// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { skillUpdateSchema } from "@/lib/api/schemas/resume/skillSets/contract"
import {
	parseJson,
	validateDataFound,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	deleteSkillByCandidateIdAndSkillSetIdAndSkillId,
	findSkillByCandidateIdAndSkillSetIdAndSkillId,
	findSkillSetByCandidateIdAndSkillSetId,
	updateSkillByCandidateIdAndSkillSetIdAndSkillId,
} from "@/lib/db/resume/skillSets/sql"

//
// GET /api/resume/[candidateId]/skillSets/[skillSetId]/[skillId].
//
export async function GET(
	_request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			candidateId: string
			skillSetId: string
			skillId: string
		}>
	},
) {
	// Candidate, skill set, skill IDs.
	const { candidateId, skillSetId, skillId } = await params

	// If the candidate, skill set, and skill IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([
		candidateId,
		skillSetId,
		skillId,
	])
	if (uuidFormatErrorResponse) return uuidFormatErrorResponse

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

	// Found skill.
	const foundSkill = await findSkillByCandidateIdAndSkillSetIdAndSkillId(
		candidateId,
		skillSetId,
		skillId,
	)

	// If the skill’s not found, return 404.
	const skillErrorResponse = validateDataFound(foundSkill, "skill", {
		skillId,
	})
	if (skillErrorResponse) return skillErrorResponse

	return NextResponse.json({ skill: foundSkill }, { status: 200 })
}

//
// PATCH /api/resume/[candidateId]/skillSets/[skillSetId]/[skillId].
//
export async function PATCH(
	request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			candidateId: string
			skillSetId: string
			skillId: string
		}>
	},
) {
	// Candidate, skill set, skill IDs.
	const { candidateId, skillSetId, skillId } = await params

	// If the candidate, skill set, and skill IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([
		candidateId,
		skillSetId,
		skillId,
	])
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
		skillUpdateSchema,
	)
	if (validatedRequestBodyOrErrorResponse instanceof NextResponse)
		return validatedRequestBodyOrErrorResponse

	// Validated request body.
	const validatedRequestBody = validatedRequestBodyOrErrorResponse

	// Updated skill.
	const updatedSkill = await updateSkillByCandidateIdAndSkillSetIdAndSkillId(
		candidateId,
		skillSetId,
		skillId,
		validatedRequestBody,
	)

	// If the skill’s not found, return 404.
	const skillErrorResponse = validateDataFound(updatedSkill, "skill", {
		skillId,
	})
	if (skillErrorResponse) return skillErrorResponse

	// If the skill’s found and updated, return 200.
	return NextResponse.json({ skill: updatedSkill }, { status: 200 })
}

//
// DELETE /api/resume/[candidateId]/skillSets/[skillSetId]/[skillId].
//
export async function DELETE(
	request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			candidateId: string
			skillSetId: string
			skillId: string
		}>
	},
) {
	// Candidate, skill set, skill IDs.
	const { candidateId, skillSetId, skillId } = await params

	// If the candidate, skill set, and skill IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([
		candidateId,
		skillSetId,
		skillId,
	])
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

	// Deleted skill.
	const deletedSkill = await deleteSkillByCandidateIdAndSkillSetIdAndSkillId(
		candidateId,
		skillSetId,
		skillId,
	)

	// If the skill’s not found, return 404.
	const skillNotFoundResponse = validateDataFound(deletedSkill, "skill", {
		skillId,
	})
	if (skillNotFoundResponse) return skillNotFoundResponse

	// If the skill’s found and deleted, return 204.
	return new NextResponse(null, { status: 204 })
}
