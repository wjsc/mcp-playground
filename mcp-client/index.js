const { Client } = require("@modelcontextprotocol/sdk/client/index.js")
const { StreamableHTTPClientTransport } = require( "@modelcontextprotocol/sdk/client/streamableHttp.js")
const { Ollama } = require('ollama') 


let client = undefined
const baseUrl = new URL("http://127.0.0.1:4000/mcp");
const ollama = new Ollama({host: 'http://127.0.0.1:11434'})

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


        const response = await ollama.chat({
            model: 'qwen2.5-coder:7b-instruct',
            messages: [
                { 
                    role: 'system',
                    content: 'You are connected to a custom mpc server with the following available tools: ' + JSON.stringify(tools)
                },
                {
                    role: 'system',
                    content: 'Please provide an explanation of the available tools and their purpose.'
                }
            
            ],
        })


        console.log(response)

        
    } catch (error) {

        console.log(error)
        
    }
    
}


run()