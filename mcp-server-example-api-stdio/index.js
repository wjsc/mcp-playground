import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "example-server",
  version: "1.0.0"
});

server.registerTool(
      "get_current_time",
      {
          title: "Returns current Argentinean Timestamp",
          description: "Returns current Argentinean Timestamp",
          inputSchema: {}
      },
      async ({ user }) => {
          const response = await fetch(`http://localhost:3000/time`);
          const data = await response.text();
          return {
          content: [{ type: "text", text: "Current time in Argentina is " + data }]
          };
      }
    );

const transport = new StdioServerTransport();
await server.connect(transport);