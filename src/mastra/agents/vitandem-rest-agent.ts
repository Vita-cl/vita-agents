import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { MCPClient } from '@mastra/mcp';
import { vitandemInstructions } from '../instructions/vitandem-instructions';

const mcpClient = new MCPClient({
  servers: {
    vitandem: {
      url: new URL(process.env.VITANDEM_MCP_SERVER_URL || 'http://localhost:8001'),
    },
  },
});

const vitandemRestTools = await mcpClient.getTools();

export const vitandemRestAgent = new Agent({
  name: 'Vitandem Admin Assistant',
  description: 'AI healthcare assistant for complete healthcare institution management using MCP tools',
  
  instructions: vitandemInstructions,
  model: google('gemini-2.5-pro'),
  tools: vitandemRestTools,
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
}); 