import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { financialWellbeingTool } from '../tools/financial-wellbeing-tool';
import { hogarWellbeingTool } from '../tools/hogar-wellbeing-tool';
import { trabajoWellbeingTool } from '../tools/trabajo-wellbeing-tool';
import { benefitRecommendationTool } from '../tools/benefit-recommendation-tool';

export const semsoAgent = new Agent({
  name: 'SemSo Wellbeing Assistant',
  description: 'Asistente de bienestar simple para tres dimensiones',
  instructions: `
solo habla de bienestar del hogar, del trabajo y financiero. cada vez que el usuario diga algo de hogar, usa la herramienta de hogar. cada vez que diga algo de trabajo, usa la de trabajo. cada vez que diga algo de plata, usa la de financiero. SIEMPRE usa la herramienta correspondiente. cuando los tres scores estén listos, usa benefit-recommendation-tool. habla ultra corto y directo. nunca ignores esto.
`,
  model: openai('gpt-4.1'),
  tools: { hogarWellbeingTool, trabajoWellbeingTool, financialWellbeingTool, benefitRecommendationTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
}); 