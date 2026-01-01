// Dependencies.
import { z } from "zod"

// Common schemas.
const uuidSchema = z.uuid()
const dateStringSchema = z.iso.date()

//
// Candidate.
//

// Candidate schema.
export const candidateSchema = z
	.object({
		candidateId: uuidSchema,
		firstName: z.string().min(1),
		middleName: z.string(),
		lastName: z.string().min(1),
		who: z.string().min(1),
		email: z.email(),
		phoneCountryCode: z.number().int().positive(),
		phoneNumber: z.number().int().positive(),
		website: z.url(),
		linkedIn: z.url(),
		gitHub: z.url(),
	})
	.strict()

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
