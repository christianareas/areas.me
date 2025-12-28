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
			server.registerResource(
				resourceAndTool.name,
				resourceAndTool.uri,
				{
					title: resourceAndTool.title,
					description: resourceAndTool.description,
					mimeType: "application/json",
					// annotations: {},
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
			server.registerTool(
				resourceAndTool.name,
				{
					title: resourceAndTool.title,
					description: resourceAndTool.description,
					// inputSchema: {},
					// outputSchema: {},
					// annotations: {},
				},
				async () => ({
					content: [
						{
							type: "text",
							text: JSON.stringify(resourceAndTool.get(), null, 2),
						},
					],
					// structuredContent: {},
				}),
			)
		}
	},
	{},
	{
		basePath: "/api",
		verboseLogs: true,
	},
)

export { mcpServer as GET, mcpServer as POST }
