## Welcome to areas.me

To learn more about my professional background, see [areas.me](https://www.areas.me). Or, [download a PDF](https://www.areas.me/api/resume/d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5/pdf).

### REST API

To programmatically interact with my resume, see [⭐️ Christian’s Resume API Reference](https://www.postman.com/areas-team/workspace/christians-resume-api/collection/19201670-532ae6dc-5207-4ab7-a80e-bef68cc077d4).

### MCP Server

You can also introduce your AI model to my resume.

#### Claude Desktop

To add [Christian’s Resume MCP Server](https://www.postman.com/areas-team/workspace/christians-resume-api/collection/689571741e32ba2fc7dd6e13) to Claude Desktop, copy and paste the following configuration to your `claude_desktop_config.json` file.

``` json
{
	"mcpServers": {
		"christian-areas": {
			"command": "npx",
			"args": [
				"-y",
				"mcp-remote",
				"https://www.areas.me/api/mcp/resume"
			]
		}
	}
}
```

To learn more, see [Connect to Local MCP Servers](https://modelcontextprotocol.io/quickstart/user).
