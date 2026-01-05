// Dependencies.
import { z } from "zod"

// Resume PUT schema.
export const resumePutSchema = z.any()

export type ResumePut = z.infer<typeof resumePutSchema>
