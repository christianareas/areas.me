// Dependencies.
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { validate } from "uuid"
import type { ZodType } from "zod"

// Validate UUID format.
export function validateUuidFormat(uuid: string | string[]) {
	const uuids = Array.isArray(uuid) ? uuid : [uuid]

	for (const uuid of uuids) {
		if (!validate(uuid)) {
			return NextResponse.json(
				{
					error: `The UUID ${uuid} isn't a valid UUID.`,
				},
				{ status: 400 },
			)
		}
	}

	return null
}

// Validate data found by ID.
export function validateDataFound<T>(
	data: T | null,
	dataName: string,
	ids: Record<string, string>,
) {
	if (!data) {
		const identifierMessage = Object.entries(ids)
			.map(([key, value]) => `${key} (${value})`)
			.join(" and ")

		return NextResponse.json(
			{
				error: `Couldn't find the ${dataName} by ${identifierMessage}.`,
			},
			{ status: 404 },
		)
	}

	return null
}

// Parse the request body JSON.
export async function parseJson(request: NextRequest) {
	let requestBody: unknown

	try {
		requestBody = await request.json()
	} catch {
		return NextResponse.json(
			{ error: "The request body isn't valid JSON." },
			{ status: 400 },
		)
	}

	return requestBody
}

// Validate the request body against the schema.
export function validateRequestBodyAgainstSchema<T>(
	requestBody: unknown,
	schema: ZodType<T>,
) {
	const parsedRequestBody = schema.safeParse(requestBody)

	if (!parsedRequestBody.success) {
		const issues = parsedRequestBody.error.issues.map((issue) => {
			const formatted: { message: string; path?: string } = {
				message: issue.message,
			}

			if (issue.code === "unrecognized_keys") {
				formatted.message = `The schema doesn't allow these fields: ${issue.keys.join(", ")}.`
				return formatted
			}

			if (issue.path.length > 0) {
				formatted.path = issue.path.join(".")
			}

			return formatted
		})

		return NextResponse.json(
			{ error: "The request body doesn't match the schema.", issues },
			{ status: 400 },
		)
	}

	return parsedRequestBody.data
}
