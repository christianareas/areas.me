// Dependencies.
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { validate } from "uuid"
import type { z } from "zod"
import {
	type Accomplishment,
	type Candidate,
	type Credential,
	type Role,
	resume,
	type Skill,
	type SkillSet,
} from "@/data/resume"

// Validate UUID format.
export function validateUuidFormat(uuid: string) {
	if (!validate(uuid)) {
		return NextResponse.json(
			{
				error: `The UUID ${uuid} isn’t valid.`,
			},
			{ status: 400 },
		)
	}

	return null
}

// Validate data found by candidate ID.
export function validateDataFoundByCandidateId<T>(
	candidateId: string,
	data: T | null,
	dataName: string,
) {
	if (!data) {
		return NextResponse.json(
			{
				error: `Couldn’t find the ${dataName} by candidateId (${candidateId}).`,
			},
			{ status: 404 },
		)
	}

	return null
}

// Validate the request body is valid JSON.
export async function parseRequestBody(request: NextRequest) {
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
	schema: z.ZodType<T>,
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
			{ error: "The request body doesn’t match the schema.", issues },
			{ status: 400 },
		)
	}

	return parsedRequestBody.data
}

//
// **
//

// Validate the candidate ID.
export function validateCandidateId(candidateId: string): NextResponse | null {
	// If there's no candidateId match, return a 404 error.
	if (resume.candidate?.candidateId !== candidateId) {
		return NextResponse.json(
			{
				error: `Couldn’t find the candidate’s resume by the candidateId (${candidateId}).`,
			},
			{ status: 404 },
		)
	}

	// Otherwise, return null.
	return null
}

// Validate the candidate, experience, skill sets, or education section.
export function validateResumeSection(
	resumeSection: Candidate | Role[] | SkillSet[] | Credential[] | undefined,
	resumeSectionName: "candidate" | "experience" | "skillSets" | "education",
): NextResponse | null {
	// If there's no resume section, return a 404 error.
	if (!resumeSection) {
		return NextResponse.json(
			{
				error: `Couldn’t find the candidate’s ${resumeSectionName}.`,
			},
			{ status: 404 },
		)
	}

	// Otherwise, return null.
	return null
}

// Validate the role, accomplishment, skill set, skill, or credential.
export function validateResumeItem(
	resumeItem: Role | Accomplishment | SkillSet | Skill | Credential | undefined,
	resumeItemName:
		| "role"
		| "accomplishment"
		| "skillSet"
		| "skill"
		| "credential",
	resumeItemId: string | undefined,
	resumeItemIdName:
		| "roleId"
		| "accomplishmentId"
		| "skillSetId"
		| "skillId"
		| "credentialId",
): NextResponse | null {
	// If there's no resume item match, return a 404 error.
	if (!resumeItem) {
		return NextResponse.json(
			{
				error: `Couldn’t find the ${resumeItemName} by the ${resumeItemIdName} (${resumeItemId}).`,
			},
			{ status: 404 },
		)
	}

	// Otherwise, return null.
	return null
}
