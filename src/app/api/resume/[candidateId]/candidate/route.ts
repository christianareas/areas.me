// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import type { Candidate } from "@/data/resume"
import {
	getCandidateById,
	validateDataFoundByCandidateId,
	validateUuidFormat,
} from "@/lib/api/resume"

//
// GET /api/resume/[candidateId]/candidate.
//
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// Validate the candidate ID is a valid UUID.
	const uuidFormatValidationResponse = validateUuidFormat(candidateId)
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Candidate.
	const candidate = await getCandidateById(candidateId)

	// Validate the candidate found.
	const candidateValidationResponse = validateDataFoundByCandidateId(
		candidateId,
		candidate,
		"candidate",
	)
	if (candidateValidationResponse) return candidateValidationResponse

	return NextResponse.json({ candidate }, { status: 200 })
}

//
// PATCH /api/resume/[candidateId]/candidate.
//
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// Validate the candidate ID is a valid UUID.
	const uuidFormatValidationResponse = validateUuidFormat(candidateId)
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Candidate.
	const candidate = await getCandidateById(candidateId)

	// Validate the candidate found.
	const candidateValidationResponse = validateDataFoundByCandidateId(
		candidateId,
		candidate,
		"candidate",
	)
	if (candidateValidationResponse) return candidateValidationResponse

	// Request body.
	const candidateUpdate = (await request.json()) as Partial<Candidate>

	// Validate the request body.
	if (
		!candidateUpdate ||
		typeof candidateUpdate !== "object" ||
		Array.isArray(candidateUpdate) ||
		Object.keys(candidateUpdate).length === 0
	) {
		return NextResponse.json(
			{
				error: "You must send an object with at least one property.",
			},
			{ status: 400 },
		)
	}

	// If there’s a candidateId in the request body, validate it.
	if (
		candidateUpdate.candidateId &&
		candidateUpdate.candidateId !== candidateId
	) {
		return NextResponse.json(
			{
				error: `The candidateId’s (${candidateId} and ${candidateUpdate.candidateId}) don’t match.`,
			},
			{ status: 400 },
		)
	}

	// Update the candidate.
	const updatedCandidate = {
		...candidate,
		...candidateUpdate,
	}

	return NextResponse.json({ candidate: updatedCandidate }, { status: 200 })
}
