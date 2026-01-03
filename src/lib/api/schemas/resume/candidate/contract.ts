// Dependencies.
import { z } from "zod"
import { candidateFields } from "@/lib/api/schemas/resume/contract"

// Candidate POST schema.
export const candidateCreateSchema = z
	.object(candidateFields)
	.omit({ candidateId: true })
	.strict()

// Candidate PATCH schema.
export const candidatePatchSchema = z
	.object(candidateFields)
	.omit({ candidateId: true })
	.partial()
	.strict()
	.refine((candidate) => Object.keys(candidate).length > 0, {
		message: "You must send an object with at least one property.",
	})

export type CandidateCreate = z.infer<typeof candidateCreateSchema>
export type CandidatePatch = z.infer<typeof candidatePatchSchema>
