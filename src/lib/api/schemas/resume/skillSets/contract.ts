// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { z } from "zod"
import { skillFields, skillSetFields } from "@/lib/api/schemas/contract"

// --------------------------------------------------------------------------------
// Skill.
// --------------------------------------------------------------------------------

export const skillCreateSchema = z
	.object(skillFields)
	.omit({ skillId: true, skillSetId: true, candidateId: true })
	.strict()

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
// Skill set.
// --------------------------------------------------------------------------------

export const skillSetCreateSchema = z
	.object(skillSetFields)
	.omit({ skillSetId: true, candidateId: true })
	.extend({
		skills: z.array(skillCreateSchema).optional(),
	})
	.strict()

export const skillSetUpdateSchema = z
	.object(skillSetFields)
	.omit({ skillSetId: true, candidateId: true })
	.partial()
	.strict()
	.refine((skillSet) => Object.keys(skillSet).length > 0, {
		message: "You must send an object with at least one property.",
	})

export type SkillSetCreate = z.infer<typeof skillSetCreateSchema>
export type SkillSetUpdate = z.infer<typeof skillSetUpdateSchema>

// --------------------------------------------------------------------------------
