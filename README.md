# First tab: Start Ollama
ollama serve
ollama pull qwen2.5-coder:7b-instruct

# Second tab: Start a simple http server

node example-api/index.js

# Third tab: Start an mcp server connected to the example-api

node mcp-server-example-api-http/index.js


// Debug mcp server with  npx @modelcontextprotocol/inspector


# Fourth Tab: Start ollmcp and connect ollama with mcp-server


python3 -m venv venv
venv/bin/pip install --upgrade ollmcp
venv/bin/ollmcp --servers-json ollmcp-servers.json --model qwen2.5-coder:7b-instruct
