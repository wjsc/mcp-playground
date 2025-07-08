const { Client } = require("@modelcontextprotocol/sdk/client/index.js")
const { StreamableHTTPClientTransport } = require( "@modelcontextprotocol/sdk/client/streamableHttp.js")

let client = undefined
const baseUrl = new URL("http://localhost:4000/mcp");

const run = async() => {
    try {
        client = new Client({
            name: 'streamable-http-client',
            version: '1.0.0'
        });
        const transport = new StreamableHTTPClientTransport(
            new URL(baseUrl)
        );

       

        await client.connect(transport);
        console.log("Connected using Streamable HTTP transport");
        const tools = await client.listTools();

        console.log(tools)
        
    } catch (error) {

        console.log("Streamable HTTP connection failed");
        console.log(error)
        
    }
    
}


run()