// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateCandidateId, validateResumeSection } from "@/lib/api/resume"
import { resume } from "@/lib/db/resume"

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

	// Experience.
	const experience = resume.experience

	// Validate experience.
	const experienceError = validateResumeSection(experience, "experience")
	if (experienceError) return experienceError

	return NextResponse.json({ experience }, { status: 200 })
}
