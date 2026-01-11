// Dependencies.
import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { credentialUpdateSchema } from "@/lib/api/schemas/resume/education/credential/contract"
import {
	parseJson,
	validateDataFound,
	validateRequestBodyAgainstSchema,
	validateUuidFormat,
} from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"
import {
	deleteCredentialByCandidateIdAndCredentialId,
	findCredentialByCandidateIdAndCredentialId,
	updateCredentialByCandidateIdAndCredentialId,
} from "@/lib/db/resume/education/credential/sql"

//
// GET /api/resume/[candidateId]/education/credentials/[credentialId].
//
export async function GET(
	_request: NextRequest,
	{
		params,
	}: { params: Promise<{ candidateId: string; credentialId: string }> },
) {
	// Candidate and credential IDs.
	const { candidateId, credentialId } = await params

	// If the candidate and credential IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([
		candidateId,
		credentialId,
	])
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

	// Found credential.
	const foundCredential = await findCredentialByCandidateIdAndCredentialId(
		candidateId,
		credentialId,
	)

	// If the credential’s not found, return 404.
	const credentialErrorResponse = validateDataFound(
		foundCredential,
		"credential",
		{ credentialId },
	)
	if (credentialErrorResponse) return credentialErrorResponse

	// If the credential’s found, return 200.
	return NextResponse.json({ credential: foundCredential }, { status: 200 })
}

//
// PATCH /api/resume/[candidateId]/education/credentials/[credentialId].
//
export async function PATCH(
	request: NextRequest,
	{
		params,
	}: { params: Promise<{ candidateId: string; credentialId: string }> },
) {
	// Candidate and credential IDs.
	const { candidateId, credentialId } = await params

	// If the candidate and credential IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([
		candidateId,
		credentialId,
	])
	if (uuidFormatErrorResponse) return uuidFormatErrorResponse

	// If authorization fails, return 401, 403, or 404.
	const authorizationErrorResponse = await authorizeApiToken(request, {
		candidateId,
		scopeRequirement: "resume:write",
	})
	if (authorizationErrorResponse) return authorizationErrorResponse

	// Found candidate.
	const foundCandidate = await findCandidateByCandidateId(candidateId)

	// If the candidate’s not found, return 404.
	const candidateErrorResponse = validateDataFound(
		foundCandidate,
		"candidate",
		{ candidateId },
	)
	if (candidateErrorResponse) return candidateErrorResponse

	// If parsing the request body fails, return 400.
	const requestBodyOrErrorResponse = await parseJson(request)
	if (requestBodyOrErrorResponse instanceof NextResponse)
		return requestBodyOrErrorResponse

	// Request body.
	const requestBody = requestBodyOrErrorResponse

	// If validating the request body against the schema fails, return 400.
	const validatedRequestBodyOrErrorResponse = validateRequestBodyAgainstSchema(
		requestBody,
		credentialUpdateSchema,
	)
	if (validatedRequestBodyOrErrorResponse instanceof NextResponse)
		return validatedRequestBodyOrErrorResponse

	// Validated request body.
	const validatedRequestBody = validatedRequestBodyOrErrorResponse

	// Updated credential.
	const updatedCredential = await updateCredentialByCandidateIdAndCredentialId(
		candidateId,
		credentialId,
		validatedRequestBody,
	)

	// If the credential’s not found, return 404.
	const credentialErrorResponse = validateDataFound(
		updatedCredential,
		"credential",
		{ credentialId },
	)
	if (credentialErrorResponse) return credentialErrorResponse

	// If the credential’s found and updated, return 200.
	return NextResponse.json({ credential: updatedCredential }, { status: 200 })
}

//
// DELETE /api/resume/[candidateId]/education/credentials/[credentialId].
//
export async function DELETE(
	request: NextRequest,
	{
		params,
	}: { params: Promise<{ candidateId: string; credentialId: string }> },
) {
	// Candidate and credential IDs.
	const { candidateId, credentialId } = await params

	// If the candidate and credential IDs aren’t valid UUIDs, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([
		candidateId,
		credentialId,
	])
	if (uuidFormatErrorResponse) return uuidFormatErrorResponse

	// If authorization fails, return 401, 403, or 404.
	const authorizationErrorResponse = await authorizeApiToken(request, {
		candidateId,
		scopeRequirement: "resume:write",
	})
	if (authorizationErrorResponse) return authorizationErrorResponse

	// Found candidate.
	const foundCandidate = await findCandidateByCandidateId(candidateId)

	// If the candidate’s not found, return 404.
	const candidateErrorResponse = validateDataFound(
		foundCandidate,
		"candidate",
		{ candidateId },
	)
	if (candidateErrorResponse) return candidateErrorResponse

	// Deleted credential.
	const deletedCredential = await deleteCredentialByCandidateIdAndCredentialId(
		candidateId,
		credentialId,
	)

	// If the credential’s not found, return 404.
	const credentialErrorResponse = validateDataFound(
		deletedCredential,
		"credential",
		{ credentialId },
	)
	if (credentialErrorResponse) return credentialErrorResponse

	// If the credential’s found and deleted, return 204.
	return new NextResponse(null, { status: 204 })
}
