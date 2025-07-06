import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { vitandemInstructions } from "../instructions/vitandem-instructions";

const mcpClient = new MCPClient({
  servers: {
    tandem: {
      url: new URL(
        process.env.ADMIN_MCP_SERVER_URL || "http://localhost:8002"
      ),
      requestInit: {
        headers: {
          "x-api-key": process.env.ADMIN_MCP_API_KEY || "",
        },
      },
    },
  },
});

const vitandemRestTools = await mcpClient.getTools();

export const vitandemRestAgent = new Agent({
  name: "Vitandem Admin Assistant",
  description:
    "AI healthcare assistant for complete healthcare institution management using MCP tools",

  instructions: vitandemInstructions,
  tools: vitandemRestTools,
  model: google("gemini-2.5-pro"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
