// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { z } from "zod"
import { candidateCreateSchema } from "@/lib/api/schemas/resume/candidate/contract"

// --------------------------------------------------------------------------------
// Resume create schema.
// --------------------------------------------------------------------------------

export const resumeCreateSchema = z
	.object({
		candidate: candidateCreateSchema,
	})
	.strict()

export type ResumeCreate = z.infer<typeof resumeCreateSchema>

// --------------------------------------------------------------------------------
