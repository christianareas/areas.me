// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { accomplishmentCreateSchema } from "@/lib/api/schemas/resume/experience/contract"
import {
	parseJson,
	validateDataFound,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	createAccomplishmentByCandidateIdAndRoleId,
	findRoleByCandidateIdAndRoleId,
} from "@/lib/db/resume/experience/sql"

//
// POST /api/resume/[candidateId]/experience/[roleId].
//
export async function POST(
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
		accomplishmentCreateSchema,
	)
	if (validatedRequestBodyOrErrorResponse instanceof NextResponse)
		return validatedRequestBodyOrErrorResponse

	// Validated request body.
	const validatedRequestBody = validatedRequestBodyOrErrorResponse

	// Created accomplishment.
	const createdAccomplishment = await createAccomplishmentByCandidateIdAndRoleId(
		candidateId,
		roleId,
		validatedRequestBody,
	)

	// If the accomplishment’s created, return 201.
	return NextResponse.json(
		{ accomplishment: createdAccomplishment },
		{ status: 201 },
	)
}

//
// GET /api/resume/[candidateId]/experience/[roleId].
//
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; roleId: string }> },
) {
	// Candidate and role IDs.
	const { candidateId, roleId } = await params

	// Validate the candidate and role IDs are valid UUIDs.
	const uuidFormatValidationResponse = validateUuidFormat([candidateId, roleId])
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Candidate.
	const candidate = await findCandidateByCandidateId(candidateId)

	// Validate the candidate found.
	const candidateValidationResponse = validateDataFound(
		candidate,
		"candidate",
		{ candidateId },
	)
	if (candidateValidationResponse) return candidateValidationResponse

	// Role.
	const role = await findRoleByCandidateIdAndRoleId(candidateId, roleId)

	// Validate the role found.
	const roleValidationResponse = validateDataFound(role, "role", {
		roleId,
	})
	if (roleValidationResponse) return roleValidationResponse

	return NextResponse.json({ role }, { status: 200 })
}
