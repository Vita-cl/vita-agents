import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { semsoAgent } from "./agents/semso-agent";
import { semsoWorkflow } from "./workflows/semso-workflow";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { vitandemRestAgent } from "./agents/vitandem-rest-agent";

export const mastra = new Mastra({
  workflows: {
    semsoWorkflow,
    weatherWorkflow,
  },
  agents: {
    semsoAgent,
    vitandemRestAgent,
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  server: {
    port: 4111,
    host: "localhost",
    cors: {
      origin: [
        "https://tandem.vita.lat",
        "https://clerk.vita.lat",
        "https://api.vita.lat",
        "https://app.vita.lat",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:8001",
        "http://localhost:8002",
      ],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: false,
    },
  },
});
