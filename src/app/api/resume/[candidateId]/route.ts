// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateCandidateId } from "@/lib/api/resume"
import { resume } from "@/lib/db/seed/resume"

// GET request.
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// Validate candidate ID.
	const candidateIdError = validateCandidateId(candidateId)
	if (candidateIdError) return candidateIdError

	return NextResponse.json({ resume }, { status: 200 })
}
