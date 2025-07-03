import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const employeeProfileSchema = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  position: z.string().optional(),
  yearsInCompany: z.number().optional(),
  familyStatus: z.string().optional(),
  location: z.string().optional(),
  department: z.string().optional(),
});

const companySettingsSchema = z.object({
  budget: z.enum(["low", "medium", "high"]).optional(),
  priorityAreas: z.array(z.string()).optional(),
  availableBenefits: z.array(z.string()).optional(),
});

const dimensionScoresSchema = z.object({
  vivienda: z.number(),
  saludMental: z.number(),
  motivacion: z.number(),
  bienestarFinanciero: z.number(),
  equilibrioVidaTrabajo: z.number(),
  saludFisica: z.number(),
  conexionesSociales: z.number(),
  desarrolloProfesional: z.number(),
});

const benefitRecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  relevanceScore: z.number(),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  reasoning: z.string(),
});

const conductInterviewStep = createStep({
  id: "conduct-interview",
  description: "Conduct wellbeing interview with employee",
  inputSchema: z.object({
    employeeId: z.string().optional(),
    sessionId: z.string().optional(),
    employeeProfile: employeeProfileSchema.optional(),
    companySettings: companySettingsSchema.optional(),
  }),
  outputSchema: z.object({
    sessionId: z.string(),
    interviewData: z.object({
      responses: z.string(),
      employeeProfile: employeeProfileSchema.optional(),
    }),
  }),
  execute: async (context) => {
    const input = context.inputData;
    const sessionId = input.sessionId || crypto.randomUUID();
    
    const mockResponses = `
      Employee responses to wellbeing questions:
      - Stress level: Medium to high
      - Work-life balance satisfaction: 3/5
      - Mental health concerns: Some anxiety about workload
      - Physical health: Generally good
      - Financial stress: Moderate
      - Social connections at work: Strong
      - Career satisfaction: High
      - Housing situation: Stable
    `;

    return {
      sessionId,
      interviewData: {
        responses: mockResponses,
        employeeProfile: input.employeeProfile,
      },
    };
  },
});

const processAssessmentStep = createStep({
  id: "process-assessment",
  description: "Process wellbeing assessment data and calculate scores",
  inputSchema: z.object({
    sessionId: z.string(),
    interviewData: z.object({
      responses: z.string(),
      employeeProfile: employeeProfileSchema.optional(),
    }),
  }),
  outputSchema: z.object({
    sessionId: z.string(),
    assessmentResults: z.object({
      overallScore: z.number(),
      riskLevel: z.enum(["low", "medium", "high", "critical"]),
      primaryConcerns: z.array(z.string()),
      strengths: z.array(z.string()),
      dimensionScores: dimensionScoresSchema,
    }),
  }),
  execute: async (context) => {
    const input = context.inputData;
    const mockScores = {
      vivienda: 80,
      saludMental: 60,
      motivacion: 85,
      bienestarFinanciero: 70,
      equilibrioVidaTrabajo: 65,
      saludFisica: 75,
      conexionesSociales: 90,
      desarrolloProfesional: 80,
    };

    const overallScore = Math.round(
      Object.values(mockScores).reduce((a, b) => a + b, 0) / Object.values(mockScores).length
    );
    
    const riskLevel: "low" | "medium" | "high" | "critical" = 
      overallScore >= 80 ? "low" : overallScore >= 60 ? "medium" : "high";

    return {
      sessionId: input.sessionId,
      assessmentResults: {
        overallScore,
        riskLevel,
        primaryConcerns: ["saludMental", "equilibrioVidaTrabajo"],
        strengths: ["motivacion", "conexionesSociales"],
        dimensionScores: mockScores,
      },
    };
  },
});

const generateRecommendationsStep = createStep({
  id: "generate-recommendations",
  description: "Generate personalized benefit recommendations",
  inputSchema: z.object({
    sessionId: z.string(),
    assessmentResults: z.object({
      overallScore: z.number(),
      riskLevel: z.enum(["low", "medium", "high", "critical"]),
      primaryConcerns: z.array(z.string()),
      strengths: z.array(z.string()),
      dimensionScores: dimensionScoresSchema,
    }),
  }),
  outputSchema: z.object({
    sessionId: z.string(),
    recommendedBenefits: z.array(benefitRecommendationSchema),
  }),
  execute: async (context) => {
    const input = context.inputData;
    const mockRecommendations = [
      {
        id: "apoyo-psicologico",
        name: "Apoyo Psicológico Empresarial",
        category: "Salud Mental",
        relevanceScore: 90,
        urgency: "high" as const,
        reasoning: "Prioridad alta debido a concerns en salud mental detectados en la evaluación",
      },
      {
        id: "flexibilidad-horaria",
        name: "Horarios Flexibles",
        category: "Equilibrio Vida-Trabajo",
        relevanceScore: 85,
        urgency: "medium" as const,
        reasoning: "Ayuda a mejorar el equilibrio vida-trabajo identificado como área de mejora",
      },
      {
        id: "programa-bienestar",
        name: "Programa de Bienestar Integral",
        category: "Bienestar General",
        relevanceScore: 75,
        urgency: "medium" as const,
        reasoning: "Beneficio integral que aborda múltiples dimensiones del bienestar",
      },
    ];

    return {
      sessionId: input.sessionId,
      recommendedBenefits: mockRecommendations,
    };
  },
});

const generateReportStep = createStep({
  id: "generate-report",
  description: "Generate comprehensive wellbeing report with action plan",
  inputSchema: z.object({
    sessionId: z.string(),
    assessmentResults: z.object({
      overallScore: z.number(),
      riskLevel: z.enum(["low", "medium", "high", "critical"]),
      primaryConcerns: z.array(z.string()),
      strengths: z.array(z.string()),
      dimensionScores: dimensionScoresSchema,
    }),
    recommendedBenefits: z.array(benefitRecommendationSchema),
  }),
  outputSchema: z.object({
    sessionId: z.string(),
    finalReport: z.object({
      executiveSummary: z.string(),
      riskLevel: z.enum(["low", "medium", "high", "critical"]),
      actionPlan: z.array(z.string()),
      timeline: z.string(),
      nextSteps: z.array(z.string()),
    }),
    wellbeingAssessment: z.object({
      overallScore: z.number(),
      riskLevel: z.enum(["low", "medium", "high", "critical"]),
      primaryConcerns: z.array(z.string()),
      strengths: z.array(z.string()),
      dimensionScores: dimensionScoresSchema,
    }),
    recommendedBenefits: z.array(benefitRecommendationSchema),
    status: z.literal("recommendations_ready"),
  }),
  execute: async (context) => {
    const input = context.inputData;
    const report = {
      executiveSummary: `Evaluación de bienestar completada. Puntuación general: ${input.assessmentResults.overallScore}/100. Nivel de riesgo: ${input.assessmentResults.riskLevel}.`,
      riskLevel: input.assessmentResults.riskLevel,
      actionPlan: [
        "Implementar beneficios prioritarios identificados",
        "Programar seguimiento en 30 días",
        "Evaluar progreso mensualmente",
      ],
      timeline: "30-90 días para implementación inicial",
      nextSteps: [
        "Revisar recomendaciones de beneficios",
        "Priorizar implementación según urgencia",
        "Coordinar con Recursos Humanos",
        "Programar seguimiento en 3 meses",
      ],
    };

    return {
      sessionId: input.sessionId,
      finalReport: report,
      wellbeingAssessment: input.assessmentResults,
      recommendedBenefits: input.recommendedBenefits,
      status: "recommendations_ready" as const,
    };
  },
});

export const semsoWorkflow = createWorkflow({
  id: "semso-wellbeing-workflow",
  description: "Complete employee wellbeing assessment and benefit recommendation workflow",
  inputSchema: z.object({
    employeeId: z.string().optional(),
    sessionId: z.string().optional(),
    employeeProfile: employeeProfileSchema.optional(),
    companySettings: companySettingsSchema.optional(),
  }),
  outputSchema: z.object({
    sessionId: z.string(),
    finalReport: z.object({
      executiveSummary: z.string(),
      riskLevel: z.enum(["low", "medium", "high", "critical"]),
      actionPlan: z.array(z.string()),
      timeline: z.string(),
      nextSteps: z.array(z.string()),
    }),
    wellbeingAssessment: z.object({
      overallScore: z.number(),
      riskLevel: z.enum(["low", "medium", "high", "critical"]),
      primaryConcerns: z.array(z.string()),
      strengths: z.array(z.string()),
      dimensionScores: dimensionScoresSchema,
    }),
    recommendedBenefits: z.array(benefitRecommendationSchema),
    status: z.literal("recommendations_ready"),
  }),
})
  .then(conductInterviewStep)
  .then(processAssessmentStep)
  .then(generateRecommendationsStep)
  .then(generateReportStep)
  .commit();
