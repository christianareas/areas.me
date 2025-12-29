// Dependencies.
import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

// Environment variables.
config({ path: ".env.local" })

// Database URL.
const databaseUrl = process.env.POSTGRES_URL
if (!databaseUrl) {
	throw new Error("There’s no POSTGRES_URL environment variable.")
}

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/lib/db/schema.ts",
	out: "./drizzle",
	dbCredentials: { url: databaseUrl },
})
