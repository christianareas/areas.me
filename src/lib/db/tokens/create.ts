// Dependencies.
import { createHash, randomBytes, randomUUID } from "node:crypto"
import { parseArgs } from "node:util"
import { config } from "dotenv"
import { eq } from "drizzle-orm"
import { validate as validateUuid } from "uuid"
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

// Throw a CLI error message.
function throwCliErrorMessage(message: string): never {
	console.log(
		[
			"Usage:",
			'  npm run db:token:create -- --candidate-id d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5 --token-name "Christian\'s Resume API Token"',
			'  npm run db:token:create -- --candidate-id d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5 --token-name "Christian\'s Resume API Token" --scopes resume:read,resume:write --expires-at 2025-01-01T00:00:00Z',
		].join("\n"),
	)

	throw new Error(message)
}

// Parse the CLI arguments.
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
	})

	// Candidate ID.
	const candidateId = argValues["candidate-id"]

	// If there’s no candidate ID, throw an error.
	if (!candidateId) {
		throwCliErrorMessage("You must pass a --candidate-id value.")
	}

	// If the candidate ID isn’t a valid UUID, throw an error.
	if (!validateUuid(candidateId)) {
		throwCliErrorMessage(`The UUID ${candidateId} isn't valid.`)
	}

	// Token name.
	const tokenName = argValues["token-name"]

	// If there’s no token name, throw an error.
	if (!tokenName) {
		throwCliErrorMessage("You must pass a --token-name value.")
	}

	// Unnormalized token scopes.
	const unnormalizedTokenScopes = (argValues.scopes ?? "resume:read")
		.split(",")
		.map((scopes) => scopes.trim())
		.filter(Boolean)

	// Normalized token scopes.
	const tokenScopes = Array.from(
		new Set(
			unnormalizedTokenScopes.includes("resume:write")
				? [...unnormalizedTokenScopes, "resume:read"]
				: unnormalizedTokenScopes,
		),
	)

	// If there are no token scopes, throw an error.
	if (tokenScopes.length === 0) {
		throwCliErrorMessage("You must pass at least one scope.")
	}

	// Expiration date.
	const tokenExpiresAt = argValues["expires-at"]
		? new Date(argValues["expires-at"])
		: null

	// If expiration date isn't a date, throw an error.
	if (tokenExpiresAt && Number.isNaN(tokenExpiresAt.getTime())) {
		throwCliErrorMessage("You must pass an --expires-at value that's a date.")
	}

	return {
		candidateId,
		tokenName,
		tokenScopes,
		tokenExpiresAt,
	}
}

// Create the API token.
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
		throw new Error(`Couldn't find the candidate by ${candidateId}.`)
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
