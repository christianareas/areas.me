// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { getCandidateByCandidateId } from "@/lib/db/resume/candidate"
import { getRoleByCandidateIdAndRoleId } from "@/lib/db/resume/experience/role"

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

	return NextResponse.json({ role }, { status: 200 })
}
