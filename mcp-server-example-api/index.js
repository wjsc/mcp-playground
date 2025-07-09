const express = require( "express")
const morgan = require('morgan')
const { randomUUID }  = require("node:crypto")
const { StreamableHTTPServerTransport } = require("@modelcontextprotocol/sdk/server/streamableHttp.js")
const { isInitializeRequest }  = require("@modelcontextprotocol/sdk/types.js")

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js") 
const z = require("zod")
const app = express();
app.use(express.json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(express.json());

// Map to store transports by session ID
const transports = {};

app.post('/mcp', async (req, res) => {
  // Check for existing session ID

  
  // if(req.body.method === "notifications/initialized") return res.send(200)
  // if(req.body.method === "tools/list") return res.send(200).json(["say-hello"])

  const sessionId = req.headers['mcp-session-id'] || undefined;
  let transport;
  
  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        transports[sessionId] = transport;
      },
      // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
      // locally, make sure to set:
      enableDnsRebindingProtection: true,
      allowedHosts: ['127.0.0.1:4000'],
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };
    const server = new McpServer({
      name: "example-server",
      version: "1.0.0",
      capabilities: {
        resources: {},
        tools: {},
      },
    });

    server.registerTool(
      "say-hello",
      {
          title: "Say hello to user",
          description: "Say hello to a user",
          inputSchema: { user: z.string() }
      },
      async ({ user }) => {
          const response = await fetch(`http://localhost:3000/hello/${user}`);
          const data = await response.text();
          return {
          content: [{ type: "text", text: data }]
          };
      }
    );

    // Connect to the MCP server
    await server.connect(transport);
  } else {
    // Invalid request

    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    });
    return;
  }

  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req, res) => {

  
  const sessionId = req.headers['mcp-session-id'] || undefined;

  
  if (!sessionId || !transports[sessionId]) {
    
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  
  const transport = transports[sessionId];

  await transport.handleRequest(req, res);
};

app.get('/mcp', handleSessionRequest);
app.delete('/mcp', handleSessionRequest);

app.listen(4000, ()=> console.log("MCP Server Listening on Port 4000"))
