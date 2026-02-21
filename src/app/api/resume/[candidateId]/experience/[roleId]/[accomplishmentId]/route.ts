// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { accomplishmentUpdateSchema } from "@/lib/api/schemas/resume/experience/contract"
import {
	parseJson,
	validateDataFound,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	deleteAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId,
	findAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId,
	findRoleByCandidateIdAndRoleId,
	updateAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId,
} from "@/lib/db/resume/experience/sql"

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId]/experience/[roleId]/[accomplishmentId].
// --------------------------------------------------------------------------------

export async function GET(
	_request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			candidateId: string
			roleId: string
			accomplishmentId: string
		}>
	},
) {
	// Candidate, role, accomplishment IDs.
	const { candidateId, roleId, accomplishmentId } = await params

	// If the candidate, role, and accomplishment IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([
		candidateId,
		roleId,
		accomplishmentId,
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

	// Found role.
	const foundRole = await findRoleByCandidateIdAndRoleId(candidateId, roleId)

	// If the role’s not found, return 404.
	const roleErrorResponse = validateDataFound(foundRole, "role", { roleId })
	if (roleErrorResponse) return roleErrorResponse

	// Found accomplishment.
	const foundAccomplishment =
		await findAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId(
			candidateId,
			roleId,
			accomplishmentId,
		)

	// If the accomplishment’s not found, return 404.
	const accomplishmentErrorResponse = validateDataFound(
		foundAccomplishment,
		"accomplishment",
		{ accomplishmentId },
	)
	if (accomplishmentErrorResponse) return accomplishmentErrorResponse

	// If the accomplishment’s found, return 200.
	return NextResponse.json(
		{ accomplishment: foundAccomplishment },
		{ status: 200 },
	)
}

// --------------------------------------------------------------------------------
// PATCH /api/resume/[candidateId]/experience/[roleId]/[accomplishmentId].
// --------------------------------------------------------------------------------

export async function PATCH(
	request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			candidateId: string
			roleId: string
			accomplishmentId: string
		}>
	},
) {
	// Candidate, role, accomplishment IDs.
	const { candidateId, roleId, accomplishmentId } = await params

	// If the candidate, role, and accomplishment IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([
		candidateId,
		roleId,
		accomplishmentId,
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

	// Found role.
	const foundRole = await findRoleByCandidateIdAndRoleId(candidateId, roleId)

	// If the role’s not found, return 404.
	const roleErrorResponse = validateDataFound(foundRole, "role", { roleId })
	if (roleErrorResponse) return roleErrorResponse

	// If parsing the request body fails, return 400.
	const requestBodyOrErrorResponse = await parseJson(request)
	if (requestBodyOrErrorResponse instanceof NextResponse)
		return requestBodyOrErrorResponse

	// Request body.
	const requestBody = requestBodyOrErrorResponse

	// If validating the request body against the schema fails, return 400.
	const validatedRequestBodyOrErrorResponse = validateRequestBodyAgainstSchema(
		requestBody,
		accomplishmentUpdateSchema,
	)
	if (validatedRequestBodyOrErrorResponse instanceof NextResponse)
		return validatedRequestBodyOrErrorResponse

	// Validated request body.
	const validatedRequestBody = validatedRequestBodyOrErrorResponse

	// Updated accomplishment.
	const updatedAccomplishment =
		await updateAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId(
			candidateId,
			roleId,
			accomplishmentId,
			validatedRequestBody,
		)

	// If the accomplishment’s not found, return 404.
	const accomplishmentErrorResponse = validateDataFound(
		updatedAccomplishment,
		"accomplishment",
		{ accomplishmentId },
	)
	if (accomplishmentErrorResponse) return accomplishmentErrorResponse

	// If the accomplishment’s found and updated, return 200.
	return NextResponse.json(
		{ accomplishment: updatedAccomplishment },
		{ status: 200 },
	)
}

// --------------------------------------------------------------------------------
// DELETE /api/resume/[candidateId]/experience/[roleId]/[accomplishmentId].
// --------------------------------------------------------------------------------

export async function DELETE(
	request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			candidateId: string
			roleId: string
			accomplishmentId: string
		}>
	},
) {
	// Candidate, role, accomplishment IDs.
	const { candidateId, roleId, accomplishmentId } = await params

	// If the candidate, role, and accomplishment IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([
		candidateId,
		roleId,
		accomplishmentId,
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

	// Found role.
	const foundRole = await findRoleByCandidateIdAndRoleId(candidateId, roleId)

	// If the role’s not found, return 404.
	const roleErrorResponse = validateDataFound(foundRole, "role", { roleId })
	if (roleErrorResponse) return roleErrorResponse

	// Deleted accomplishment.
	const deletedAccomplishment =
		await deleteAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId(
			candidateId,
			roleId,
			accomplishmentId,
		)

	// If the accomplishment’s not found, return 404.
	const accomplishmentNotFoundResponse = validateDataFound(
		deletedAccomplishment,
		"accomplishment",
		{ accomplishmentId },
	)
	if (accomplishmentNotFoundResponse) return accomplishmentNotFoundResponse

	// If the accomplishment’s found and deleted, return 204.
	return new NextResponse(null, { status: 204 })
}

// --------------------------------------------------------------------------------
