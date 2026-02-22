// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

// --------------------------------------------------------------------------------
// Database URL.
// --------------------------------------------------------------------------------

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	throw new Error("There's no DATABASE_URL environment variable.")
}

// --------------------------------------------------------------------------------
// Database.
// --------------------------------------------------------------------------------

export const db = drizzle({
	client: new Pool({ connectionString: databaseUrl }),
})

// --------------------------------------------------------------------------------
