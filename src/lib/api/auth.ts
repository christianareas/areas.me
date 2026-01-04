// Dependencies.
import { createHash } from "node:crypto"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { apiTokens } from "@/lib/db/schema"

// Types.
type ApiAuthOptions = {
	candidateId: string
	scopeRequirement: string
}

// Authorize the API token.
export async function authorizeApiToken(
	request: NextRequest,
	{ candidateId, scopeRequirement }: ApiAuthOptions,
) {
	// Authorization header.
	const authorizationHeader = request.headers.get("authorization")

	// If there’s no Authorization header, return an error.
	if (!authorizationHeader) {
		return NextResponse.json(
			{ error: "You must send an Authorization header." },
			{ status: 401 },
		)
	}

	// Bearer token.
	const [scheme, token] = authorizationHeader.trim().split(/\s+/)

	// If the Authorization header is not a Bearer token, return an error.
	if (scheme?.toLowerCase() !== "bearer" || !token) {
		return NextResponse.json(
			{ error: "You must send a Bearer token." },
			{ status: 401 },
		)
	}

	// API token hash.
	const tokenHash = createHash("sha256").update(token).digest("hex")

	// Select API token.
	const [apiToken] = await db
		.select({
			candidateId: apiTokens.candidateId,
			scopes: apiTokens.scopes,
			expiresAt: apiTokens.expiresAt,
			revokedAt: apiTokens.revokedAt,
		})
		.from(apiTokens)
		.where(eq(apiTokens.hash, tokenHash))
		.limit(1)

	// If there’s no API token, return an error.
	if (!apiToken) {
		return NextResponse.json(
			{ error: "Your API token isn't valid." },
			{ status: 401 },
		)
	}

	// If the API token is revoked, return an error.
	if (apiToken.revokedAt) {
		return NextResponse.json(
			{ error: "Someone revoked your API token." },
			{ status: 401 },
		)
	}

	// If the API token is expired, return an error.
	if (apiToken.expiresAt && apiToken.expiresAt <= new Date()) {
		return NextResponse.json(
			{ error: "Your API token expired." },
			{ status: 401 },
		)
	}

	// If the API token’s candidateId doesn’t match, return an error.
	if (apiToken.candidateId !== candidateId) {
		return NextResponse.json(
			{
				error: `Couldn't find the candidate by candidateId (${candidateId}).`,
			},
			{ status: 404 },
		)
	}

	// If the API token doesn’t meet the scope requirement, return an error.
	if (!apiToken.scopes.includes(scopeRequirement)) {
		return NextResponse.json(
			{ error: `Your API token must have the ${scopeRequirement} scope.` },
			{ status: 403 },
		)
	}

	return null
}
