import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const financialWellbeingTool = createTool({
  id: "financial-wellbeing",
  description:
    "Analiza la respuesta del usuario y actualiza su evaluación de bienestar financiero",
  inputSchema: z.object({
    userResponse: z
      .number()
      .describe(
        "Score de 0-100 para bienestar financiero basado en la respuesta del usuario"
      ),
  }),

  execute: async ({ context }) => {
    return context;
  },
});
