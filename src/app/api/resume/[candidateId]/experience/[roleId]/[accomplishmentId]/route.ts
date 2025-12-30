// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateCandidateId, validateResumeItem } from "@/lib/api/resume"
import { resume } from "@/lib/db/resume"

// GET request.
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

	// Validate candidate ID.
	const candidateIdError = validateCandidateId(candidateId)
	if (candidateIdError) return candidateIdError

	// Role.
	const role = resume.experience?.find((role) => role.roleId === roleId)

	// Validate role.
	const roleError = validateResumeItem(role, "role", roleId, "roleId")
	if (roleError) return roleError

	// Accomplishment.
	const accomplishment = role?.accomplishments?.find(
		(accomplishment) => accomplishment.accomplishmentId === accomplishmentId,
	)

	// Validate role.
	const accomplishmentError = validateResumeItem(
		accomplishment,
		"accomplishment",
		accomplishmentId,
		"accomplishmentId",
	)
	if (accomplishmentError) return accomplishmentError

	return NextResponse.json({ accomplishment }, { status: 200 })
}
