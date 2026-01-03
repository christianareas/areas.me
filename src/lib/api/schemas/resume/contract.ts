// Dependencies.
import { z } from "zod"

// Primitives.
const uuidSchema = z.uuid()
const dateStringSchema = z.iso.date()

//
// Candidate.
//

// Candidate fields.
export const candidateFields = {
	candidateId: uuidSchema,
	firstName: z
		.string()
		.min(1, "The candidate's first name must contain at least one character."),
	middleName: z.string(),
	lastName: z
		.string()
		.min(1, "The candidate's last name must contain at least one character."),
	who: z
		.string()
		.min(1, "The candidate's who must contain at least one character."),
	email: z.email({
		message: "The candidate's email isn't a valid email address.",
	}),
	phoneCountryCode: z.number().int().positive(),
	phoneNumber: z.number().int().positive(),
	website: z.url({
		message: "The candidate's website URL isn't a valid URL.",
	}),
	linkedIn: z.url({
		message: "The candidate's LinkedIn URL isn't a valid URL.",
	}),
	gitHub: z.url({
		message: "The candidate's GitHub URL isn't a valid URL.",
	}),
}

// Candidate schema.
export const candidateSchema = z.object(candidateFields).strict()

//
// Experience.
//

// Accomplishment schema.
export const accomplishmentSchema = z
	.object({
		candidateId: uuidSchema,
		roleId: uuidSchema,
		accomplishmentId: uuidSchema,
		accomplishment: z.string(),
		sortOrder: z.number().int(),
	})
	.strict()

// Role schema.
export const roleSchema = z
	.object({
		candidateId: uuidSchema,
		roleId: uuidSchema,
		company: z.string(),
		role: z.string(),
		startDate: dateStringSchema,
		endDate: dateStringSchema.nullable(),
		accomplishments: z.array(accomplishmentSchema).optional(),
	})
	.strict()

//
// Skill sets.
//

// Skill schema.
export const skillSchema = z
	.object({
		candidateId: uuidSchema,
		skillSetId: uuidSchema,
		skillId: uuidSchema,
		skill: z.string(),
		sortOrder: z.number().int(),
	})
	.strict()

// Skill set schema.
export const skillSetSchema = z
	.object({
		candidateId: uuidSchema,
		skillSetId: uuidSchema,
		skillSetType: z.enum([
			"apps",
			"command-line-tools",
			"databases",
			"frameworks",
			"cloud-deployments",
			"languages",
			"specifications",
		]),
		sortOrder: z.number().int(),
		skills: z.array(skillSchema),
	})
	.strict()

//
// Education.
//

// Credential schema.
export const credentialSchema = z
	.object({
		candidateId: uuidSchema,
		credentialId: uuidSchema,
		institution: z.string(),
		credential: z.string(),
		startDate: dateStringSchema.nullable(),
		endDate: dateStringSchema.nullable(),
	})
	.strict()

//
// Resume.
//

// Resume schema.
export const resumeSchema = z
	.object({
		candidate: candidateSchema,
		experience: z.array(roleSchema).optional(),
		skillSets: z.array(skillSetSchema).optional(),
		education: z.array(credentialSchema).optional(),
	})
	.strict()

export type SeedResume = z.infer<typeof resumeSchema>
