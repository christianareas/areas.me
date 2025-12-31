// Dependencies.
import {
	bigint,
	date,
	index,
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
export const roles = pgTable(
	"roles",
	{
		roleId: uuid("role_id").primaryKey(),
		candidateId: uuid("candidate_id")
			.notNull()
			.references(() => candidates.candidateId, { onDelete: "cascade" }),
		company: text("company").notNull(),
		role: text("role").notNull(),
		startDate: date("start_date", { mode: "string" }).notNull(),
		endDate: date("end_date", { mode: "string" }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("roles_candidate_id_end_date_start_date_company_index").on(
			table.candidateId,
			table.endDate,
			table.startDate,
			table.company,
		),
	],
)

// Accomplishments table.
export const accomplishments = pgTable(
	"accomplishments",
	{
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
	},
	(table) => [
		index("accomplishments_candidate_id_role_id_sort_order_index").on(
			table.candidateId,
			table.roleId,
			table.sortOrder,
		),
	],
)

//
// Skill sets.
//

// Skill sets table.
export const skillSets = pgTable(
	"skill_sets",
	{
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
	},
	(table) => [
		index("skill_sets_candidate_id_sort_order_index").on(
			table.candidateId,
			table.sortOrder,
		),
	],
)

// Skills table.
export const skills = pgTable(
	"skills",
	{
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
	},
	(table) => [
		index("skills_candidate_id_skill_set_id_sort_order_index").on(
			table.candidateId,
			table.skillSetId,
			table.sortOrder,
		),
	],
)

//
// Education.
//

// Credentials table.
export const credentials = pgTable(
	"credentials",
	{
		credentialId: uuid("credential_id").primaryKey(),
		candidateId: uuid("candidate_id")
			.notNull()
			.references(() => candidates.candidateId, { onDelete: "cascade" }),
		institution: text("institution").notNull(),
		credential: text("credential").notNull(),
		startDate: date("start_date", { mode: "string" }),
		endDate: date("end_date", { mode: "string" }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("credentials_candidate_id_end_date_start_date_index").on(
			table.candidateId,
			table.endDate,
			table.startDate,
		),
	],
)
