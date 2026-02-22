// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { z } from "zod"
import { accomplishmentFields, roleFields } from "@/lib/api/schemas/contract"

// --------------------------------------------------------------------------------
// Accomplishment.
// --------------------------------------------------------------------------------

export const accomplishmentCreateSchema = z
	.object(accomplishmentFields)
	.omit({ accomplishmentId: true, roleId: true, candidateId: true })
	.strict()

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

// --------------------------------------------------------------------------------
// Role.
// --------------------------------------------------------------------------------

export const roleCreateSchema = z
	.object(roleFields)
	.omit({ roleId: true, candidateId: true })
	.extend({
		accomplishments: z.array(accomplishmentCreateSchema).optional(),
	})
	.strict()

export const roleUpdateSchema = z
	.object(roleFields)
	.omit({ roleId: true, candidateId: true })
	.partial()
	.strict()
	.refine((role) => Object.keys(role).length > 0, {
		message: "You must send an object with at least one property.",
	})

export type RoleCreate = z.infer<typeof roleCreateSchema>
export type RoleUpdate = z.infer<typeof roleUpdateSchema>

// --------------------------------------------------------------------------------
