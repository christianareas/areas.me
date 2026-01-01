// Dependencies.
import { cache } from "react"
import { getResumeByCandidateId } from "@/lib/db/resume/resume"

// Cache resume.
export const getResume = cache(async (candidateId: string) =>
	getResumeByCandidateId(candidateId),
)
