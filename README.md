# First tab: Start Ollama
ollama serve

# Second tab: Start a simple http server

node example-api/index.js

# Third tab: Start an mcp server connected to the example-api

node mcp-server-example-api/index.js

# Fourth Tab: Start ollmcp and connect ollama with mcp-server


python3 -m venv venv
venv/bin/pip install ollmcp
venv/bin/ollmcp --servers-json ollmcp-servers.json