// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import { findCredentialByCandidateIdAndCredentialId } from "@/lib/db/resume/education/credential/sql"

//
// GET /api/resume/[candidateId]/education/[credentialId].
//
export async function GET(
	_request: NextRequest,
	{
		params,
	}: { params: Promise<{ candidateId: string; credentialId: string }> },
) {
	// Candidate and credential IDs.
	const { candidateId, credentialId } = await params

	// Validate the candidate and credential IDs are valid UUIDs.
	const uuidFormatValidationResponse = validateUuidFormat([
		candidateId,
		credentialId,
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

	// Credential.
	const credential = await findCredentialByCandidateIdAndCredentialId(
		candidateId,
		credentialId,
	)

	// Validate the credential found.
	const credentialValidationResponse = validateDataFound(
		credential,
		"credential",
		{ candidateId, credentialId },
	)
	if (credentialValidationResponse) return credentialValidationResponse

	return NextResponse.json({ credential }, { status: 200 })
}
