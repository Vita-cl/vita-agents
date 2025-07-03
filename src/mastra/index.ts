import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { semsoAgent } from './agents/semso-agent';
import { semsoWorkflow } from './workflows/semso-workflow';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';

export const mastra = new Mastra({
  workflows: {
    semsoWorkflow,
    weatherWorkflow,
  },
  agents: { 
    semsoAgent,
    weatherAgent,
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server: {
    port: 4111,
    host: 'localhost',
  },
});
