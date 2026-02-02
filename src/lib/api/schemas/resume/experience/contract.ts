// Dependencies.
import { z } from "zod"
import { accomplishmentFields } from "@/lib/api/schemas/contract"

// Accomplishment create schema.
export const accomplishmentCreateSchema = z
	.object(accomplishmentFields)
	.omit({ accomplishmentId: true, roleId: true, candidateId: true })
	.strict()

// Accomplishment update schema.
export const accomplishmentUpdateSchema = z
	.object(accomplishmentFields)
	.omit({ accomplishmentId: true, roleId: true, candidateId: true })
	.partial()
	.strict()
	.refine((accomplishment) => Object.keys(accomplishment).length > 0, {
		message: "You must send an object with at least one property.",
	})

export type AccomplishmentCreate = z.infer<typeof accomplishmentCreateSchema>
export type AccomplishmentUpdate = z.infer<typeof accomplishmentUpdateSchema>
