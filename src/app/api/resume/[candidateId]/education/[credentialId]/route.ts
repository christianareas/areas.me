// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateCandidateId, validateResumeItem } from "@/lib/api/resume"
import { resume } from "@/lib/db/resume"

// GET request.
export async function GET(
	_request: NextRequest,
	{
		params,
	}: { params: Promise<{ candidateId: string; credentialId: string }> },
) {
	// Candidate and credential IDs.
	const { candidateId, credentialId } = await params

	// Validate candidate ID.
	const candidateIdError = validateCandidateId(candidateId)
	if (candidateIdError) return candidateIdError

	// Credential.
	const credential = resume.education?.find(
		(credential) => credential.credentialId === credentialId,
	)

	// Validate credential.
	const credentialError = validateResumeItem(
		credential,
		"credential",
		credentialId,
		"credentialId",
	)
	if (credentialError) return credentialError

	return NextResponse.json({ credential }, { status: 200 })
}
