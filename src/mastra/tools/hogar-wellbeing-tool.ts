import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const hogarWellbeingTool = createTool({
  id: "hogar-wellbeing",
  description:
    "Analiza la respuesta del usuario y actualiza su evaluación de bienestar del hogar",
  inputSchema: z.object({
    userResponse: z
      .number()
      .describe(
        "Score de 0-100 para bienestar del hogar basado en la respuesta del usuario"
      ),
  }),
  execute: async ({ context }) => {
    return context;
  },
});
