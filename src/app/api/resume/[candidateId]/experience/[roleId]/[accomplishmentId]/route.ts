// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	deleteAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId,
	findAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId,
	findRoleByCandidateIdAndRoleId,
} from "@/lib/db/resume/experience/sql"

//
// GET /api/resume/[candidateId]/experience/[roleId]/[accomplishmentId].
//
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

	return NextResponse.json(
		{ accomplishment: foundAccomplishment },
		{ status: 200 },
	)
}

//
// DELETE /api/resume/[candidateId]/experience/[roleId]/[accomplishmentId].
//
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
