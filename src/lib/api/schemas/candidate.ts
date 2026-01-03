// Dependencies.
import { z } from "zod"

// Candidate PATCH schema.
export const candidatePatchSchema = z
	.object({
		// Candidate’s name.
		firstName: z
			.string()
			.min(1, "The candidate's first name must contain at least one character.")
			.optional(),
		middleName: z.string().optional(),
		lastName: z
			.string()
			.min(1, "The candidate's last name must contain at least one character.")
			.optional(),

		// Candidate’s who.
		who: z
			.string()
			.min(1, "The candidate's “who” must contain at least one character.")
			.optional(),

		// Candidate’s contact.
		email: z
			.email({ message: "The candidate's email isn't a valid email address." })
			.optional(),
		phoneCountryCode: z.number().int().positive().optional(),
		phoneNumber: z.number().int().positive().optional(),

		// Candidate’s sites.
		website: z
			.url({ message: "The candidate's website URL isn't a valid URL." })
			.optional(),
		linkedIn: z
			.url({ message: "The candidate's LinkedIn URL isn't a valid URL." })
			.optional(),
		gitHub: z
			.url({ message: "The candidate's GitHub URL isn't a valid URL." })
			.optional(),
	})
	.strict()
	.refine((obj) => Object.keys(obj).length > 0, {
		message: "You must send an object with at least one property.",
	})

export type CandidatePatch = z.infer<typeof candidatePatchSchema>
