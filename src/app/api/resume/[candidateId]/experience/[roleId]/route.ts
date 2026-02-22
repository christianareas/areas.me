// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { roleUpdateSchema } from "@/lib/api/schemas/resume/experience/contract"
import {
	catchServerError,
	parseJson,
	validateDataFound,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	deleteRoleByCandidateIdAndRoleId,
	findRoleByCandidateIdAndRoleId,
	updateRoleByCandidateIdAndRoleId,
} from "@/lib/db/resume/experience/sql"

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId]/experience/[roleId].
// --------------------------------------------------------------------------------

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; roleId: string }> },
) {
	// Candidate and role IDs.
	const { candidateId, roleId } = await params

	// If the candidate and role IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId, roleId])
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

		// Found role.
		const foundRole = await findRoleByCandidateIdAndRoleId(candidateId, roleId)

		// If the role’s not found, return 404.
		const roleErrorResponse = validateDataFound(foundRole, "role", {
			roleId,
		})
		if (roleErrorResponse) return roleErrorResponse

		// If the role’s found, return 200.
		return NextResponse.json({ role: foundRole }, { status: 200 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
// PATCH /api/resume/[candidateId]/experience/[roleId].
// --------------------------------------------------------------------------------

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; roleId: string }> },
) {
	// Candidate and role IDs.
	const { candidateId, roleId } = await params

	// If the candidate and role IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId, roleId])
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
		roleUpdateSchema,
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

		// Updated role.
		const updatedRole = await updateRoleByCandidateIdAndRoleId(
			candidateId,
			roleId,
			validatedRequestBody,
		)

		// If the role’s not found, return 404.
		const roleErrorResponse = validateDataFound(updatedRole, "role", {
			roleId,
		})
		if (roleErrorResponse) return roleErrorResponse

		// If the role’s found and updated, return 200.
		return NextResponse.json({ role: updatedRole }, { status: 200 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
// DELETE /api/resume/[candidateId]/experience/[roleId].
// --------------------------------------------------------------------------------

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; roleId: string }> },
) {
	// Candidate and role IDs.
	const { candidateId, roleId } = await params

	// If the candidate and role IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId, roleId])
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

		// Deleted role.
		const deletedRole = await deleteRoleByCandidateIdAndRoleId(
			candidateId,
			roleId,
		)

		// If the role’s not found, return 404.
		const roleErrorResponse = validateDataFound(deletedRole, "role", { roleId })
		if (roleErrorResponse) return roleErrorResponse

		// If the role’s found and deleted, return 204.
		return new NextResponse(null, { status: 204 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
