// Dependencies.
import { createMcpHandler } from "mcp-handler"
import { resume } from "@/data/resume"

// MCP server.
const mcpServer = createMcpHandler(
	(server) => {
		// Candidate.
		const { candidate } = resume

		const resourcesAndTools = [
			// Resume.
			{
				title: "Resume",
				name: "resume",
				description:
					"The candidate’s resume, including their who, contact details, experience, skill sets, and education.",
				uri: `resume://${candidate?.candidateId}`,
				get: () => resume,
			},
		]

		// Resources and tools.
		for (const resourceAndTool of resourcesAndTools) {
			// Resources.
			server.resource(
				resourceAndTool.name,
				resourceAndTool.uri,
				{
					title: resourceAndTool.title,
					description: resourceAndTool.description,
					mimeType: "application/json",
				},
				async (uri) => ({
					contents: [
						{
							uri: uri.href,
							text: JSON.stringify(resourceAndTool.get(), null, 2),
							mimeType: "application/json",
						},
					],
				}),
			)

			// Tools.
			server.tool(
				resourceAndTool.name,
				resourceAndTool.description,
				{
					title: resourceAndTool.title,
					description: resourceAndTool.description,
					idempotentHint: true,
				},
				async () => ({
					content: [
						{
							type: "text",
							text: JSON.stringify(resourceAndTool.get(), null, 2),
						},
					],
				}),
			)

			// Prompts.
		}
	},
	{},
	{
		basePath: "/api/resume",
		streamableHttpEndpoint: "/mcp",
	},
)

export { mcpServer as GET, mcpServer as POST }
