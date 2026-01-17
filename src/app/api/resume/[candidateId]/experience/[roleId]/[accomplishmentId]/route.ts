// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId } from "@/lib/db/resume/experience/role/accomplishment/sql"
import { findRoleByCandidateIdAndRoleId } from "@/lib/db/resume/experience/role/sql"

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

	// Validate the candidate, role, and accomplishment IDs are valid UUIDs.
	const uuidFormatValidationResponse = validateUuidFormat([
		candidateId,
		roleId,
		accomplishmentId,
	])
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
		candidateId,
		roleId,
	})
	if (roleValidationResponse) return roleValidationResponse

	// Accomplishment.
	const accomplishment =
		await findAccomplishmentByCandidateIdAndRoleIdAndAccomplishmentId(
			candidateId,
			roleId,
			accomplishmentId,
		)

	// Validate the accomplishment found.
	const accomplishmentValidationResponse = validateDataFound(
		accomplishment,
		"accomplishment",
		{ candidateId, roleId, accomplishmentId },
	)
	if (accomplishmentValidationResponse) return accomplishmentValidationResponse

	return NextResponse.json({ accomplishment }, { status: 200 })
}
