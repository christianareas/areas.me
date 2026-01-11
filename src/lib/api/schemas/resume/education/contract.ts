// Dependencies.
import { z } from "zod"
import { credentialFields } from "@/lib/api/schemas/contract"

// Credential create schema.
export const credentialCreateSchema = z
	.object(credentialFields)
	.omit({ credentialId: true, candidateId: true })
	.strict()

// Credential update schema.
export const credentialUpdateSchema = z
	.object(credentialFields)
	.omit({ credentialId: true, candidateId: true })
	.partial()
	.strict()
	.refine((credential) => Object.keys(credential).length > 0, {
		message: "You must send an object with at least one property.",
	})

export type CredentialCreate = z.infer<typeof credentialCreateSchema>
export type CredentialUpdate = z.infer<typeof credentialUpdateSchema>
