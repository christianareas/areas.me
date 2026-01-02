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

export const candidates = pgTable(
	"candidates",
	{
		candidateId: uuid("candidate_id").primaryKey(), // Primary key.
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
	},
	() => [],
)

//
// Experience.
//

export const roles = pgTable(
	"roles",
	{
		roleId: uuid("role_id").primaryKey(), // Primary key.
		candidateId: uuid("candidate_id")
			.notNull()
			.references(() => candidates.candidateId, { onDelete: "cascade" }), // Foreign key.
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
	(roles) => [
		index("roles_candidate_end_start_company_role_id_index").on(
			roles.candidateId,
			roles.endDate.desc().nullsFirst(),
			roles.startDate.desc(),
			roles.company,
			roles.role,
			roles.roleId,
		),
	],
)

export const accomplishments = pgTable(
	"accomplishments",
	{
		accomplishmentId: uuid("accomplishment_id").primaryKey(), // Primary key.
		candidateId: uuid("candidate_id")
			.notNull()
			.references(() => candidates.candidateId, { onDelete: "cascade" }), // Foreign key.
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.roleId, { onDelete: "cascade" }), // Foreign key.
		accomplishment: text("accomplishment").notNull(),
		sortOrder: integer("sort_order").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(accomplishments) => [
		index("accomplishments_candidate_role_sort_index").on(
			accomplishments.candidateId,
			accomplishments.roleId,
			accomplishments.sortOrder,
		),
	],
)

//
// Skill sets.
//

export const skillSets = pgTable(
	"skill_sets",
	{
		skillSetId: uuid("skill_set_id").primaryKey(), // Primary key.
		candidateId: uuid("candidate_id")
			.notNull()
			.references(() => candidates.candidateId, { onDelete: "cascade" }), // Foreign key.
		skillSetType: text("skill_set_type").notNull(),
		sortOrder: integer("sort_order").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(skill_sets) => [
		index("skill_sets_candidate_sort_index").on(
			skill_sets.candidateId,
			skill_sets.sortOrder,
		),
	],
)

export const skills = pgTable(
	"skills",
	{
		skillId: uuid("skill_id").primaryKey(), // Primary key.
		candidateId: uuid("candidate_id")
			.notNull()
			.references(() => candidates.candidateId, { onDelete: "cascade" }), // Foreign key.
		skillSetId: uuid("skill_set_id")
			.notNull()
			.references(() => skillSets.skillSetId, { onDelete: "cascade" }), // Foreign key.
		skill: text("skill").notNull(),
		sortOrder: integer("sort_order").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(skills) => [
		index("skills_candidate_skill_set_sort_index").on(
			skills.candidateId,
			skills.skillSetId,
			skills.sortOrder,
		),
	],
)

//
// Education.
//

export const credentials = pgTable(
	"credentials",
	{
		credentialId: uuid("credential_id").primaryKey(), // Primary key.
		candidateId: uuid("candidate_id")
			.notNull()
			.references(() => candidates.candidateId, { onDelete: "cascade" }), // Foreign key.
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
	(credentials) => [
		index("credentials_candidate_end_start_index").on(
			credentials.candidateId,
			credentials.endDate,
			credentials.startDate,
		),
	],
)
