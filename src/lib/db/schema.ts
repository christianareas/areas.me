// Dependencies.
import {
	bigint,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core"

// Candidate table.
export const candidates = pgTable("candidates", {
	// Candidate ID.
	candidateId: uuid("candidate_id").primaryKey(),

	// Candidate’s name.
	firstName: text("first_name").notNull(),
	middleName: text("middle_name").notNull(),
	lastName: text("last_name").notNull(),

	// Candidate’s who.
	who: text("who").notNull(),

	// Candidate’s contact.
	email: text("email").notNull(),
	phoneCountryCode: integer("phone_country_code").notNull(),
	phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),

	// Candidate’s sites.
	website: text("website").notNull(),
	linkedIn: text("linkedin").notNull(),
	gitHub: text("github").notNull(),

	// Timestamps.
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
})
