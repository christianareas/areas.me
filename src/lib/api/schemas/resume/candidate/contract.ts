// Dependencies.
import { z } from "zod"
import { candidateFields } from "@/lib/api/schemas/contract"

// Candidate create schema.
export const candidateCreateSchema = z
	.object(candidateFields)
	.omit({ candidateId: true })
	.strict()

// Candidate update schema.
export const candidateUpdateSchema = z
	.object(candidateFields)
	.omit({ candidateId: true })
	.partial()
	.strict()
	.refine((candidate) => Object.keys(candidate).length > 0, {
		message: "You must send an object with at least one property.",
	})

export type CandidateCreate = z.infer<typeof candidateCreateSchema>
export type CandidateUpdate = z.infer<typeof candidateUpdateSchema>
