// Dependencies.
import { createHash, randomBytes, randomUUID } from "node:crypto"
import { parseArgs } from "node:util"
import { config } from "dotenv"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { apiTokens, candidates } from "@/lib/db/schema"

// Types.
type Args = {
	candidateId: string
	tokenName: string
	tokenScopes: string[]
	tokenExpiresAt: Date | null
}

// Environment variables.
config({ path: ".env.local" })

// Throw CLI error message.
function throwCliErrorMessage(message: string): never {
	console.log(
		[
			"Usage:",
			'  npm run db:token:create -- --candidate-id d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5 --token-name "Christian’s Resume API Token" --scopes resume:read,resume:write',
			'  npm run db:token:create -- --candidate-id d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5 --token-name "Christian’s Resume API Token" --scopes resume:read --expires-at 2025-01-01T00:00:00Z',
		].join("\n"),
	)

	throw new Error(message)
}

// Parse CLI arguments.
function parseCliArgs(argv: string[]): Args {
	// Parse arguments.
	const { values: argValues } = parseArgs({
		args: argv,
		options: {
			"candidate-id": { type: "string" },
			"token-name": { type: "string" },
			scopes: { type: "string" },
			"expires-at": { type: "string" },
		},
		allowPositionals: true,
	})

	// Candidate ID.
	const candidateId = argValues["candidate-id"]

	if (!candidateId) {
		throwCliErrorMessage("You must pass a --candidate-id value.")
	}

	// Token name.
	const tokenName = argValues["token-name"]

	if (!tokenName) {
		throwCliErrorMessage("You must pass a --token-name value.")
	}

	// Scopes.
	const scopesValue = argValues.scopes

	const tokenScopes = (scopesValue ?? "resume:read")
		.split(",")
		.map((scopes) => scopes.trim())
		.filter(Boolean)

	// Expires at.
	const tokenExpiresAtValue = argValues["expires-at"]
	const tokenExpiresAt = tokenExpiresAtValue
		? new Date(tokenExpiresAtValue)
		: null

	if (tokenExpiresAt && Number.isNaN(tokenExpiresAt.getTime())) {
		throwCliErrorMessage("You must pass a valid --expires-at value.")
	}

	return { candidateId, tokenName, tokenScopes, tokenExpiresAt }
}

// Main.
async function main() {
	const { candidateId, tokenName, tokenScopes, tokenExpiresAt } = parseCliArgs(
		process.argv.slice(2),
	)

	// Select candidate.
	const [candidate] = await db
		.select({ candidateId: candidates.candidateId })
		.from(candidates)
		.where(eq(candidates.candidateId, candidateId))
		.limit(1)

	// If there’s no candidate, throw an error.
	if (!candidate) {
		throw new Error(`Couldn’t find the candidate by ${candidateId}.`)
	}

	// Token.
	const token = randomBytes(32).toString("base64url")
	const tokenPrefix = token.slice(0, 8)
	const tokenHash = createHash("sha256").update(token).digest("hex")

	// Insert token.
	await db.insert(apiTokens).values({
		tokenId: randomUUID(),
		candidateId,
		name: tokenName,
		prefix: tokenPrefix,
		hash: tokenHash,
		scopes: tokenScopes,
		expiresAt: tokenExpiresAt,
	})

	// Console log token.
	console.log("Candidate ID:", candidateId)
	console.log("Token:", token)
	console.log("Prefix:", tokenPrefix)
	console.log("Scopes:", tokenScopes.join(", "))
	if (tokenExpiresAt) console.log("Expires:", tokenExpiresAt.toISOString())
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
