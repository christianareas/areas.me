// Dependencies.
import { config } from "dotenv"
import { db } from "@/lib/db"
import {
	accomplishments,
	candidates,
	credentials,
	roles,
	skillSets,
	skills,
} from "@/lib/db/schema"
import { resume } from "@/lib/db/seed/resume"
import { resumeSchema } from "@/lib/db/seed/resume.schema"

// Environment variables.
config({ path: ".env.local" })

// Seed the database.
async function main() {
	const parsedResume = resumeSchema.parse(resume)

	// Candidate.
	const candidate = parsedResume.candidate

	// If there’s no candidate, throw an error.
	if (!candidate) {
		throw new Error("There’s no candidate.")
	}

	// Collections.
	const experience = parsedResume.experience ?? []
	const skillSetsData = parsedResume.skillSets ?? []
	const education = parsedResume.education ?? []

	await db.transaction(async (tx) => {
		// Upsert candidates.
		await tx
			.insert(candidates)
			.values(candidate)
			.onConflictDoUpdate({
				target: candidates.candidateId,
				set: {
					...candidate,
					updatedAt: new Date(),
				},
			})

		// Upsert roles.
		for (const role of experience) {
			await tx
				.insert(roles)
				.values({
					candidateId: role.candidateId,
					roleId: role.roleId,
					company: role.company,
					role: role.role,
					startDate: role.startDate,
					endDate: role.endDate,
				})
				.onConflictDoUpdate({
					target: roles.roleId,
					set: {
						candidateId: role.candidateId,
						roleId: role.roleId,
						company: role.company,
						role: role.role,
						startDate: role.startDate,
						endDate: role.endDate,
						updatedAt: new Date(),
					},
				})
		}

		// Upsert accomplishments.
		for (const role of experience) {
			const roleAccomplishments = role.accomplishments ?? []
			for (const accomplishment of roleAccomplishments) {
				await tx
					.insert(accomplishments)
					.values({
						candidateId: accomplishment.candidateId,
						roleId: accomplishment.roleId,
						accomplishmentId: accomplishment.accomplishmentId,
						accomplishment: accomplishment.accomplishment,
						sortOrder: accomplishment.sortOrder,
					})
					.onConflictDoUpdate({
						target: accomplishments.accomplishmentId,
						set: {
							...accomplishment,
							updatedAt: new Date(),
						},
					})
			}
		}

		// Upsert skill sets.
		for (const skillSet of skillSetsData) {
			await tx
				.insert(skillSets)
				.values({
					candidateId: skillSet.candidateId,
					skillSetId: skillSet.skillSetId,
					skillSetType: skillSet.skillSetType,
					sortOrder: skillSet.sortOrder,
				})
				.onConflictDoUpdate({
					target: skillSets.skillSetId,
					set: {
						candidateId: skillSet.candidateId,
						skillSetId: skillSet.skillSetId,
						skillSetType: skillSet.skillSetType,
						sortOrder: skillSet.sortOrder,
						updatedAt: new Date(),
					},
				})
		}

		// Upsert skills.
		for (const skillSet of skillSetsData) {
			for (const skill of skillSet.skills) {
				await tx
					.insert(skills)
					.values({
						candidateId: skill.candidateId,
						skillSetId: skill.skillSetId,
						skillId: skill.skillId,
						skill: skill.skill,
						sortOrder: skill.sortOrder,
					})
					.onConflictDoUpdate({
						target: skills.skillId,
						set: {
							...skill,
							updatedAt: new Date(),
						},
					})
			}
		}

		// Upsert credentials.
		for (const credential of education) {
			await tx
				.insert(credentials)
				.values({
					candidateId: credential.candidateId,
					credentialId: credential.credentialId,
					institution: credential.institution,
					credential: credential.credential,
					startDate: credential.startDate,
					endDate: credential.endDate,
				})
				.onConflictDoUpdate({
					target: credentials.credentialId,
					set: {
						...credential,
						updatedAt: new Date(),
					},
				})
		}
	})

	// Log the seeded data.
	console.log("Seeded candidate:", candidate.candidateId)
	console.log("Seeded roles:", experience.length)
	console.log(
		"Seeded accomplishments:",
		experience.reduce((sum, r) => sum + (r.accomplishments?.length ?? 0), 0),
	)
	console.log("Seeded skill sets:", skillSetsData.length)
	console.log(
		"Seeded skills:",
		skillSetsData.reduce((sum, s) => sum + s.skills.length, 0),
	)
	console.log("Seeded credentials:", education.length)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
