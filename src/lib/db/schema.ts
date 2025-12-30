// Dependencies.
import {
	bigint,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core"

//
// Candidate.
//

// Candidate table.
export const candidates = pgTable("candidates", {
	candidateId: uuid("candidate_id").primaryKey(),
	firstName: text("first_name").notNull(),
	middleName: text("middle_name").notNull(),
	lastName: text("last_name").notNull(),
	who: text("who").notNull(),
	email: text("email").notNull(),
	phoneCountryCode: integer("phone_country_code").notNull(),
	phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
	website: text("website").notNull(),
	linkedIn: text("linkedin").notNull(),
	gitHub: text("github").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})

//
// Experience.
//

// Roles table.
export const roles = pgTable("roles", {
	roleId: uuid("role_id").primaryKey(),
	candidateId: uuid("candidate_id")
		.notNull()
		.references(() => candidates.candidateId, { onDelete: "cascade" }),
	company: text("company").notNull(),
	role: text("role").notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})

// Accomplishments table.
export const accomplishments = pgTable("accomplishments", {
	accomplishmentId: uuid("accomplishment_id").primaryKey(),
	candidateId: uuid("candidate_id")
		.notNull()
		.references(() => candidates.candidateId, { onDelete: "cascade" }),
	roleId: uuid("role_id")
		.notNull()
		.references(() => roles.roleId, { onDelete: "cascade" }),
	accomplishment: text("accomplishment").notNull(),
	sortOrder: integer("sort_order").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})

//
// Skill sets.
//

// Skill sets table.
export const skillSets = pgTable("skill_sets", {
	skillSetId: uuid("skill_set_id").primaryKey(),
	candidateId: uuid("candidate_id")
		.notNull()
		.references(() => candidates.candidateId, { onDelete: "cascade" }),
	skillSetType: text("skill_set_type").notNull(),
	sortOrder: integer("sort_order").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})

// Skills table.
export const skills = pgTable("skills", {
	skillId: uuid("skill_id").primaryKey(),
	candidateId: uuid("candidate_id")
		.notNull()
		.references(() => candidates.candidateId, { onDelete: "cascade" }),
	skillSetId: uuid("skill_set_id")
		.notNull()
		.references(() => skillSets.skillSetId, { onDelete: "cascade" }),
	skill: text("skill").notNull(),
	sortOrder: integer("sort_order").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})

//
// Education.
//

// Credentials table.
export const credentials = pgTable("credentials", {
	credentialId: uuid("credential_id").primaryKey(),
	candidateId: uuid("candidate_id")
		.notNull()
		.references(() => candidates.candidateId, { onDelete: "cascade" }),
	institution: text("institution").notNull(),
	credential: text("credential").notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})
