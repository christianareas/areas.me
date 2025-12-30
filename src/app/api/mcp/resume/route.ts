// Dependencies.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { resume } from "@/lib/db/resume"

// Server.
const createServer = () => {
	// Candidate.
	const { candidate } = resume

	const candidateId = candidate?.candidateId
	if (!candidateId) throw new Error("There’s no candidate.candidateId.")

	const candidateFirstName = candidate?.firstName
	if (!candidateFirstName) throw new Error("There’s no candidate.firstName.")

	// Server information.
	const server = new McpServer({
		name: `${candidateFirstName}’s Resume MCP Server`,
		version: "0.1.0",
		websiteUrl: "https://www.areas.me/api/mcp/resume",
	})

	// Resources.
	server.registerResource(
		"resume",
		`resume://${candidateId}`,
		{
			title: `${candidateFirstName}’s Resume`,
			description: `${candidateFirstName}’s resume, including their who, contact details, experience, skill sets, and education.`,
			mimeType: "application/json",
		},
		async (uri) => ({
			contents: [
				{
					uri: uri.href,
					mimeType: "application/json",
					text: JSON.stringify(resume, null, 2),
				},
			],
		}),
	)

	// Tools.
	server.registerTool(
		"get-resume",
		{
			title: `Get ${candidateFirstName}’s Resume`,
			description: `Get ${candidateFirstName}’s resume, including their who, contact details, experience, skill sets, and education.`,
		},
		async () => ({
			content: [
				{
					type: "text",
					text: JSON.stringify(resume, null, 2),
				},
			],
		}),
	)

	server.registerTool(
		"get-resume-pdf-download-link",
		{
			title: `Get ${candidateFirstName}’s Resume (PDF)`,
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
		async () => ({
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: `Who is ${candidateFirstName}? Tell me more, based on their resume.\n\n${JSON.stringify(resume, null, 2)}`,
					},
				},
			],
		}),
	)

	return server
}

export async function POST(req: Request) {
	const server = createServer()

	const transport = new WebStandardStreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
		enableJsonResponse: true,
	})

	await server.connect(transport)

	return transport.handleRequest(req)
}
