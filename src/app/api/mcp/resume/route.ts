// Dependencies.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { getFirstCandidateId } from "@/lib/db/resume/candidate/candidate"
import { getResumeByCandidateId } from "@/lib/db/resume/resume"

// Server.
const createServer = async () => {
	// Candidate ID.
	const candidateId = await getFirstCandidateId()
	if (!candidateId)
		throw new Error(
			`Couldn't find the candidate by candidateId (${candidateId}).`,
		)

	// Resume.
	const initialResume = await getResumeByCandidateId(candidateId)
	if (!initialResume)
		throw new Error(`Couldn't find the resume by candidateId (${candidateId}).`)

	const candidateFirstName = initialResume.candidate.firstName
	if (!candidateFirstName)
		throw new Error(`Couldn't find the candidate's first name.`)

	const loadResume = async () => {
		const resume = await getResumeByCandidateId(candidateId)
		if (!resume)
			throw new Error(
				`Couldn't find the resume by candidateId (${candidateId}).`,
			)
		return resume
	}

	// Server information.
	const server = new McpServer({
		name: `${candidateFirstName}'s Resume MCP Server`,
		version: "0.1.0",
		websiteUrl: "https://www.areas.me/api/mcp/resume",
	})

	// Resources.
	server.registerResource(
		"resume",
		`resume://${candidateId}`,
		{
			title: `${candidateFirstName}'s Resume`,
			description: `${candidateFirstName}'s resume, including their who, contact details, experience, skill sets, and education.`,
			mimeType: "application/json",
		},
		async (uri) => {
			const resume = await loadResume()
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: "application/json",
						text: JSON.stringify(resume, null, 2),
					},
				],
			}
		},
	)

	// Tools.
	server.registerTool(
		"get-resume",
		{
			title: `Get ${candidateFirstName}'s Resume`,
			description: `Get ${candidateFirstName}'s resume, including their who, contact details, experience, skill sets, and education.`,
		},
		async () => {
			const resume = await loadResume()
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(resume, null, 2),
					},
				],
			}
		},
	)

	server.registerTool(
		"get-resume-pdf-download-link",
		{
			title: `Get ${candidateFirstName}'s Resume (PDF)`,
			description: `Get ${candidateFirstName}'s resume as a PDF.`,
		},
		async () => {
			const pdfUrl = `https://www.areas.me/api/resume/${candidateId}/pdf`

			return {
				content: [
					{
						type: "text",
						text: `${pdfUrl}.`,
					},
				],
			}
		},
	)

	// Prompts.
	server.registerPrompt(
		`who-is-${candidateFirstName.toLowerCase()}`,
		{
			title: `Who is ${candidateFirstName}?`,
			description: `Tell me about ${candidateFirstName}, based on their resume.`,
		},
		async () => {
			const resume = await loadResume()
			const currentFirstName = resume.candidate.firstName || candidateFirstName
			return {
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: `Who is ${currentFirstName}? Tell me more, based on their resume.\n\n${JSON.stringify(resume, null, 2)}`,
						},
					},
				],
			}
		},
	)

	return server
}

export async function POST(req: Request) {
	const server = await createServer()

	const transport = new WebStandardStreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
		enableJsonResponse: true,
	})

	await server.connect(transport)

	return transport.handleRequest(req)
}
