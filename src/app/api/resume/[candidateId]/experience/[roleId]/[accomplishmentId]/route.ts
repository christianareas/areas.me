// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { getCandidateByCandidateId } from "@/lib/db/resume/candidate/candidate"
import { getAccomplishmentByCandidateIdRoleIdAndAccomplishmentId } from "@/lib/db/resume/experience/accomplishment"
import { getRoleByCandidateIdAndRoleId } from "@/lib/db/resume/experience/role"

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
	const candidate = await getCandidateByCandidateId(candidateId)

	// Validate the candidate found.
	const candidateValidationResponse = validateDataFound(
		candidate,
		"candidate",
		{ candidateId },
	)
	if (candidateValidationResponse) return candidateValidationResponse

	// Role.
	const role = await getRoleByCandidateIdAndRoleId(candidateId, roleId)

	// Validate the role found.
	const roleValidationResponse = validateDataFound(role, "role", {
		candidateId,
		roleId,
	})
	if (roleValidationResponse) return roleValidationResponse

	// Accomplishment.
	const accomplishment =
		await getAccomplishmentByCandidateIdRoleIdAndAccomplishmentId(
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
