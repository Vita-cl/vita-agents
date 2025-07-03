import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const trabajoWellbeingTool = createTool({
  id: "trabajo-wellbeing",
  description: "Analiza la respuesta del usuario y actualiza su evaluación de bienestar del trabajo",
  inputSchema: z.object({
    userResponse: z.number().describe("Score de 0-100 para bienestar del trabajo basado en la respuesta del usuario"),
  }),
  execute: async ({ context }) => {
    return context;
  },
}); 