// Dependencies.
import { eq } from "drizzle-orm"
import type { CandidatePatch } from "@/lib/api/schemas/candidate"
import { db } from "@/lib/db"
import { candidates } from "@/lib/db/schema"

// Get education by ID.
export async function getCandidateByCandidateId(candidateId: string) {
	return null
}