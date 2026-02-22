// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { randomUUID } from "node:crypto"
import { and, eq } from "drizzle-orm"
import type {
	SkillCreate,
	SkillSetCreate,
	SkillSetUpdate,
	SkillUpdate,
} from "@/lib/api/schemas/resume/skillSets/contract"
import { db } from "@/lib/db"
import { transformSkillSetRowsToObjects } from "@/lib/db/resume/transform"
import { skillSets, skills } from "@/lib/db/schema"

// --------------------------------------------------------------------------------
// Fields.
// --------------------------------------------------------------------------------

const skillSetFields = {
	candidateId: skillSets.candidateId,
	skillSetId: skillSets.skillSetId,
	skillSetType: skillSets.skillSetType,
	skillSetSortOrder: skillSets.sortOrder,
}

const skillFields = {
	skillId: skills.skillId,
	skill: skills.skill,
	sortOrder: skills.sortOrder,
}

// --------------------------------------------------------------------------------
// Skill sets.
// --------------------------------------------------------------------------------

export async function findSkillSetsByCandidateId(candidateId: string) {
	// Select skill sets and skills.
	const skillSetRows = await db
		.select({
			...skillSetFields,
			...skillFields,
		})
		.from(skillSets)
		.leftJoin(
			skills,
			and(
				eq(skills.candidateId, skillSets.candidateId),
				eq(skills.skillSetId, skillSets.skillSetId),
			),
		)
		.where(eq(skillSets.candidateId, candidateId))
		.orderBy(skillSets.sortOrder, skillSets.skillSetId, skills.sortOrder)

	return transformSkillSetRowsToObjects(skillSetRows)
}

// --------------------------------------------------------------------------------
// Skill set.
// --------------------------------------------------------------------------------

export async function createSkillSetByCandidateId(
	candidateId: string,
	skillSetCreate: SkillSetCreate,
) {
	const skillSetId = randomUUID()
	const { skillSetType, sortOrder } = skillSetCreate
	const { skills: skillsCreate = [] } = skillSetCreate

	// Insert skill set and skills.
	return db.transaction(async (tx) => {
		// Insert skill set.
		const [newSkillSet] = await tx
			.insert(skillSets)
			.values({
				candidateId,
				skillSetId,
				skillSetType,
				sortOrder,
			})
			.returning({
				candidateId: skillSets.candidateId,
				skillSetId: skillSets.skillSetId,
				skillSetType: skillSets.skillSetType,
				sortOrder: skillSets.sortOrder,
				createdAt: skillSets.createdAt,
			})

		if (!newSkillSet) return null

		// Insert skills.
		let newSkills: { skillId: string; skill: string; sortOrder: number }[] = []
		if (skillsCreate.length > 0) {
			newSkills = await tx
				.insert(skills)
				.values(
					skillsCreate.map((skillCreate) => ({
						candidateId,
						skillSetId,
						skillId: randomUUID(),
						...skillCreate,
					})),
				)
				.returning({
					skillId: skills.skillId,
					skill: skills.skill,
					sortOrder: skills.sortOrder,
				})
		}

		return {
			...newSkillSet,
			skills: newSkills,
		}
	})
}

export async function findSkillSetByCandidateIdAndSkillSetId(
	candidateId: string,
	skillSetId: string,
) {
	// Select skill set and skills.
	const skillSetRows = await db
		.select({
			...skillSetFields,
			...skillFields,
		})
		.from(skillSets)
		.leftJoin(
			skills,
			and(
				eq(skills.candidateId, skillSets.candidateId),
				eq(skills.skillSetId, skillSets.skillSetId),
			),
		)
		.where(
			and(
				eq(skillSets.candidateId, candidateId),
				eq(skillSets.skillSetId, skillSetId),
			),
		)
		.orderBy(skills.sortOrder)

	const [skillSetObject] = transformSkillSetRowsToObjects(skillSetRows)

	return skillSetObject ?? null
}

export async function updateSkillSetByCandidateIdAndSkillSetId(
	candidateId: string,
	skillSetId: string,
	skillSetUpdate: SkillSetUpdate,
) {
	// Update skill set.
	const [updatedSkillSet] = await db
		.update(skillSets)
		.set({
			...skillSetUpdate,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(skillSets.candidateId, candidateId),
				eq(skillSets.skillSetId, skillSetId),
			),
		)
		.returning({
			candidateId: skillSets.candidateId,
			skillSetId: skillSets.skillSetId,
			skillSetType: skillSets.skillSetType,
			sortOrder: skillSets.sortOrder,
			updatedAt: skillSets.updatedAt,
		})

	return updatedSkillSet ?? null
}

export async function deleteSkillSetByCandidateIdAndSkillSetId(
	candidateId: string,
	skillSetId: string,
) {
	// Delete skill set.
	const [deletedSkillSet] = await db
		.delete(skillSets)
		.where(
			and(
				eq(skillSets.candidateId, candidateId),
				eq(skillSets.skillSetId, skillSetId),
			),
		)
		.returning({ candidateId: skillSets.candidateId })

	return deletedSkillSet ?? null
}

// --------------------------------------------------------------------------------
// Skill.
// --------------------------------------------------------------------------------

export async function createSkillByCandidateIdAndSkillSetId(
	candidateId: string,
	skillSetId: string,
	skillCreate: SkillCreate,
) {
	// Insert skill.
	const [newSkill] = await db
		.insert(skills)
		.values({
			...skillCreate,
			candidateId,
			skillSetId,
			skillId: randomUUID(),
		})
		.returning({
			candidateId: skills.candidateId,
			skillSetId: skills.skillSetId,
			...skillFields,
			createdAt: skills.createdAt,
		})

	return newSkill ?? null
}

export async function findSkillByCandidateIdAndSkillSetIdAndSkillId(
	candidateId: string,
	skillSetId: string,
	skillId: string,
) {
	// Select skill set and skill.
	const [skill] = await db
		.select({
			candidateId: skillSets.candidateId,
			skillSetId: skillSets.skillSetId,
			...skillFields,
		})
		.from(skillSets)
		.innerJoin(
			skills,
			and(
				eq(skills.candidateId, skillSets.candidateId),
				eq(skills.skillSetId, skillSets.skillSetId),
			),
		)
		.where(
			and(
				eq(skillSets.candidateId, candidateId),
				eq(skillSets.skillSetId, skillSetId),
				eq(skills.skillId, skillId),
			),
		)
		.limit(1)

	return skill ?? null
}

export async function updateSkillByCandidateIdAndSkillSetIdAndSkillId(
	candidateId: string,
	skillSetId: string,
	skillId: string,
	skillUpdate: SkillUpdate,
) {
	// Update skill.
	const [updatedSkill] = await db
		.update(skills)
		.set({ ...skillUpdate, updatedAt: new Date() })
		.where(
			and(
				eq(skills.candidateId, candidateId),
				eq(skills.skillSetId, skillSetId),
				eq(skills.skillId, skillId),
			),
		)
		.returning({
			candidateId: skills.candidateId,
			skillSetId: skills.skillSetId,
			...skillFields,
			updatedAt: skills.updatedAt,
		})

	return updatedSkill ?? null
}

export async function deleteSkillByCandidateIdAndSkillSetIdAndSkillId(
	candidateId: string,
	skillSetId: string,
	skillId: string,
) {
	// Delete skill.
	const [deletedSkill] = await db
		.delete(skills)
		.where(
			and(
				eq(skills.candidateId, candidateId),
				eq(skills.skillSetId, skillSetId),
				eq(skills.skillId, skillId),
			),
		)
		.returning({ candidateId: skills.candidateId })

	return deletedSkill ?? null
}

// --------------------------------------------------------------------------------
