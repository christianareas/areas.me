// Dependencies.
import { NextResponse } from "next/server"
import {
	type Accomplishment,
	type Candidate,
	type Credential,
	type Role,
	resume,
	type Skill,
	type SkillSet,
} from "@/data/resume"

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
