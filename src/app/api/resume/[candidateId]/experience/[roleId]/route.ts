// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findRoleByCandidateIdAndRoleId } from "@/lib/db/resume/experience/sql"

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId]/experience/[roleId].
// --------------------------------------------------------------------------------

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; roleId: string }> },
) {
	// Candidate and role IDs.
	const { candidateId, roleId } = await params

	// If the candidate and role IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId, roleId])
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
	const roleErrorResponse = validateDataFound(foundRole, "role", {
		roleId,
	})
	if (roleErrorResponse) return roleErrorResponse

	// If the role’s found, return 200.
	return NextResponse.json({ role: foundRole }, { status: 200 })
}

// --------------------------------------------------------------------------------
