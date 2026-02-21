// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { z } from "zod"
import { skillFields } from "@/lib/api/schemas/contract"

// --------------------------------------------------------------------------------
// Skill create schema.
// --------------------------------------------------------------------------------

export const skillCreateSchema = z
	.object(skillFields)
	.omit({ skillId: true, skillSetId: true, candidateId: true })
	.strict()

// --------------------------------------------------------------------------------
// Skill update schema.
// --------------------------------------------------------------------------------

export const skillUpdateSchema = z
	.object(skillFields)
	.omit({ skillId: true, skillSetId: true, candidateId: true })
	.partial()
	.strict()
	.refine((skill) => Object.keys(skill).length > 0, {
		message: "You must send an object with at least one property.",
	})

export type SkillCreate = z.infer<typeof skillCreateSchema>
export type SkillUpdate = z.infer<typeof skillUpdateSchema>

// --------------------------------------------------------------------------------
