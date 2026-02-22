// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { authorizeApiToken } from "@/lib/api/auth"
import { resumeCreateSchema } from "@/lib/api/schemas/resume/contract"
import {
	catchServerError,
	parseJson,
	validateDataCreated,
	validateRequestBodyAgainstSchema,
} from "@/lib/api/validate"
import { createResume } from "@/lib/db/resume/sql"

// --------------------------------------------------------------------------------
// POST /api/resume.
// --------------------------------------------------------------------------------

export async function POST(request: NextRequest) {
	// If authorization fails, return 401, 403, or 404.
	const authorizationErrorResponse = await authorizeApiToken(request, {
		scopeRequirement: "resume:create",
	})
	if (authorizationErrorResponse) return authorizationErrorResponse

	// If parsing the request body fails, return 400.
	const requestBodyOrErrorResponse = await parseJson(request)
	if (requestBodyOrErrorResponse instanceof NextResponse)
		return requestBodyOrErrorResponse

	// Request body.
	const requestBody = requestBodyOrErrorResponse

	// If validating the request body against the schema fails, return 400.
	const validatedRequestBodyOrErrorResponse = validateRequestBodyAgainstSchema(
		requestBody,
		resumeCreateSchema,
	)
	if (validatedRequestBodyOrErrorResponse instanceof NextResponse)
		return validatedRequestBodyOrErrorResponse

	// Validated request body.
	const validatedRequestBody = validatedRequestBodyOrErrorResponse

	try {
		// Created resume.
		const createdResume = await createResume(validatedRequestBody)

		// If the resume’s not created, return 500.
		const createErrorResponse = validateDataCreated(createdResume, "resume", {})
		if (createErrorResponse) return createErrorResponse

		// If the resume’s created, return 201.
		return NextResponse.json({ resume: createdResume }, { status: 201 })
	} catch (error) {
		return catchServerError(error, request)
	}
}

// --------------------------------------------------------------------------------
