// Dependencies.
import { config } from "dotenv"
import { eq } from "drizzle-orm"
import { resume } from "@/data/resume"
import { db } from "@/lib/db"
import { candidates } from "@/lib/db/schema"

// Environment variables.
config({ path: ".env.local" })

// Seed the database.
async function main() {
	// Candidate.
	const candidate = resume.candidate

	// If there’s no candidate, throw an error.
	if (!candidate) {
		throw new Error("There’s no candidate.")
	}

	// Upsert.
	await db
		.insert(candidates)
		.values(candidate)
		.onConflictDoUpdate({
			target: candidates.candidateId,
			set: {
				...candidate,
				updatedAt: new Date(),
			},
		})

	// Log the seeded data.
	const row = await db
		.select()
		.from(candidates)
		.where(eq(candidates.candidateId, candidate.candidateId))

	console.log("Seeded the data:", row[0])
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
