// Dependencies.
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Database URL.
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	throw new Error("There's no DATABASE_URL environment variable.")
}

export const db = drizzle({ client: neon(databaseUrl) })
