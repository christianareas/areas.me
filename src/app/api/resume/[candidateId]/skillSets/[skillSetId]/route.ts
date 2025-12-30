// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { validateCandidateId, validateResumeItem } from "@/lib/api/resume"
import { resume } from "@/lib/db/resume"

// GET request.
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string; skillSetId: string }> },
) {
	// Candidate and skill set IDs.
	const { candidateId, skillSetId } = await params

	// Validate candidate ID.
	const candidateIdError = validateCandidateId(candidateId)
	if (candidateIdError) return candidateIdError

	// Skill set.
	const skillSet = resume.skillSets?.find(
		(skillSet) => skillSet.skillSetId === skillSetId,
	)

	// Validate skill set.
	const skillSetError = validateResumeItem(
		skillSet,
		"skillSet",
		skillSetId,
		"skillSetId",
	)
	if (skillSetError) return skillSetError

	return NextResponse.json({ skillSet }, { status: 200 })
}
