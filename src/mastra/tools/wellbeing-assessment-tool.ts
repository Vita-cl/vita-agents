import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface WellbeingDimension {
  score: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  insights: string[];
  recommendations: string[];
}

interface WellbeingAssessment {
  vivienda: WellbeingDimension;
  saludMental: WellbeingDimension;
  motivacion: WellbeingDimension;
  bienestarFinanciero: WellbeingDimension;
  equilibrioVidaTrabajo: WellbeingDimension;
  saludFisica: WellbeingDimension;
  conexionesSociales: WellbeingDimension;
  desarrolloProfesional: WellbeingDimension;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  primaryConcerns: string[];
  strengths: string[];
}

export const wellbeingAssessmentTool = createTool({
  id: 'assess-wellbeing',
  description: 'Analiza las respuestas de la entrevista de bienestar y genera puntuaciones para cada dimensión',
  inputSchema: z.object({
    responses: z.string().describe('Respuestas completas del usuario durante la entrevista'),
    employeeProfile: z.object({
      age: z.number().optional(),
      position: z.string().optional(),
      yearsInCompany: z.number().optional(),
      familyStatus: z.string().optional(),
      location: z.string().optional(),
    }).optional(),
  }),
  outputSchema: z.object({
    assessment: z.object({
      vivienda: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        insights: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      saludMental: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        insights: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      motivacion: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        insights: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      bienestarFinanciero: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        insights: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      equilibrioVidaTrabajo: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        insights: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      saludFisica: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        insights: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      conexionesSociales: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        insights: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      desarrolloProfesional: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        insights: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      overallScore: z.number(),
      riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
      primaryConcerns: z.array(z.string()),
      strengths: z.array(z.string()),
    }),
  }),
  execute: async ({ context }) => {
    const { responses, employeeProfile } = context;
    
    const assessment = await analyzeWellbeingResponses(responses, employeeProfile);
    
    return {
      assessment,
    };
  },
});

const analyzeWellbeingResponses = async (
  responses: string,
  employeeProfile?: {
    age?: number;
    position?: string;
    yearsInCompany?: number;
    familyStatus?: string;
    location?: string;
  }
): Promise<WellbeingAssessment> => {
  const scores = extractDimensionScores(responses);
  const insights = generateInsights(responses, scores);
  const recommendations = generateRecommendations(scores, employeeProfile);
  
  const overallScore = calculateOverallScore(scores);
  const riskLevel = determineRiskLevel(scores);
  const primaryConcerns = identifyPrimaryConcerns(scores);
  const strengths = identifyStrengths(scores);

  return {
    vivienda: {
      score: scores.vivienda,
      priority: determinePriority(scores.vivienda),
      insights: insights.vivienda,
      recommendations: recommendations.vivienda,
    },
    saludMental: {
      score: scores.saludMental,
      priority: determinePriority(scores.saludMental),
      insights: insights.saludMental,
      recommendations: recommendations.saludMental,
    },
    motivacion: {
      score: scores.motivacion,
      priority: determinePriority(scores.motivacion),
      insights: insights.motivacion,
      recommendations: recommendations.motivacion,
    },
    bienestarFinanciero: {
      score: scores.bienestarFinanciero,
      priority: determinePriority(scores.bienestarFinanciero),
      insights: insights.bienestarFinanciero,
      recommendations: recommendations.bienestarFinanciero,
    },
    equilibrioVidaTrabajo: {
      score: scores.equilibrioVidaTrabajo,
      priority: determinePriority(scores.equilibrioVidaTrabajo),
      insights: insights.equilibrioVidaTrabajo,
      recommendations: recommendations.equilibrioVidaTrabajo,
    },
    saludFisica: {
      score: scores.saludFisica,
      priority: determinePriority(scores.saludFisica),
      insights: insights.saludFisica,
      recommendations: recommendations.saludFisica,
    },
    conexionesSociales: {
      score: scores.conexionesSociales,
      priority: determinePriority(scores.conexionesSociales),
      insights: insights.conexionesSociales,
      recommendations: recommendations.conexionesSociales,
    },
    desarrolloProfesional: {
      score: scores.desarrolloProfesional,
      priority: determinePriority(scores.desarrolloProfesional),
      insights: insights.desarrolloProfesional,
      recommendations: recommendations.desarrolloProfesional,
    },
    overallScore,
    riskLevel,
    primaryConcerns,
    strengths,
  };
};

const extractDimensionScores = (responses: string) => {
  const viviendaKeywords = ['casa', 'arriendo', 'vivienda', 'hogar', 'barrio', 'vivir'];
  const saludMentalKeywords = ['estrés', 'ansiedad', 'depresión', 'mental', 'emocional', 'psicológico'];
  const motivacionKeywords = ['motivado', 'trabajo', 'satisfecho', 'propósito', 'sentido'];
  const financieroKeywords = ['dinero', 'sueldo', 'deudas', 'ahorros', 'económico', 'financiero'];
  const equilibrioKeywords = ['tiempo', 'familia', 'descanso', 'equilibrio', 'vida-trabajo'];
  const saludFisicaKeywords = ['ejercicio', 'salud', 'físico', 'deporte', 'alimentación'];
  const socialesKeywords = ['amigos', 'familia', 'social', 'relaciones', 'apoyo'];
  const desarrolloKeywords = ['capacitación', 'carrera', 'crecimiento', 'desarrollo', 'aprender'];

  const loweredResponses = responses.toLowerCase();
  
  return {
    vivienda: calculateDimensionScore(loweredResponses, viviendaKeywords),
    saludMental: calculateDimensionScore(loweredResponses, saludMentalKeywords),
    motivacion: calculateDimensionScore(loweredResponses, motivacionKeywords),
    bienestarFinanciero: calculateDimensionScore(loweredResponses, financieroKeywords),
    equilibrioVidaTrabajo: calculateDimensionScore(loweredResponses, equilibrioKeywords),
    saludFisica: calculateDimensionScore(loweredResponses, saludFisicaKeywords),
    conexionesSociales: calculateDimensionScore(loweredResponses, socialesKeywords),
    desarrolloProfesional: calculateDimensionScore(loweredResponses, desarrolloKeywords),
  };
};

const calculateDimensionScore = (responses: string, keywords: string[]): number => {
  const positiveWords = ['bien', 'bueno', 'excelente', 'satisfecho', 'feliz', 'contento', 'genial'];
  const negativeWords = ['mal', 'malo', 'terrible', 'insatisfecho', 'triste', 'preocupado', 'estresado'];
  
  let score = 50;
  let relevanceCount = 0;
  
  keywords.forEach(keyword => {
    if (responses.includes(keyword)) {
      relevanceCount++;
      
      positiveWords.forEach(positive => {
        if (responses.includes(`${keyword} ${positive}`) || responses.includes(`${positive} ${keyword}`)) {
          score += 15;
        }
      });
      
      negativeWords.forEach(negative => {
        if (responses.includes(`${keyword} ${negative}`) || responses.includes(`${negative} ${keyword}`)) {
          score -= 20;
        }
      });
    }
  });
  
  if (relevanceCount === 0) score = 60;
  
  return Math.max(0, Math.min(100, score));
};

const generateInsights = (responses: string, scores: any) => {
  return {
    vivienda: generateDimensionInsights('vivienda', scores.vivienda, responses),
    saludMental: generateDimensionInsights('saludMental', scores.saludMental, responses),
    motivacion: generateDimensionInsights('motivacion', scores.motivacion, responses),
    bienestarFinanciero: generateDimensionInsights('bienestarFinanciero', scores.bienestarFinanciero, responses),
    equilibrioVidaTrabajo: generateDimensionInsights('equilibrioVidaTrabajo', scores.equilibrioVidaTrabajo, responses),
    saludFisica: generateDimensionInsights('saludFisica', scores.saludFisica, responses),
    conexionesSociales: generateDimensionInsights('conexionesSociales', scores.conexionesSociales, responses),
    desarrolloProfesional: generateDimensionInsights('desarrolloProfesional', scores.desarrolloProfesional, responses),
  };
};

const generateDimensionInsights = (dimension: string, score: number, responses: string): string[] => {
  const insights = [];
  
  if (score >= 80) {
    insights.push(`Excelente estado en ${dimension}. Mantener las buenas prácticas actuales.`);
  } else if (score >= 60) {
    insights.push(`Buen nivel en ${dimension} con oportunidades de mejora.`);
  } else if (score >= 40) {
    insights.push(`${dimension} requiere atención y apoyo para mejorar.`);
  } else {
    insights.push(`${dimension} está en estado crítico y necesita intervención inmediata.`);
  }
  
  return insights;
};

const generateRecommendations = (scores: any, employeeProfile?: any) => {
  return {
    vivienda: generateDimensionRecommendations('vivienda', scores.vivienda),
    saludMental: generateDimensionRecommendations('saludMental', scores.saludMental),
    motivacion: generateDimensionRecommendations('motivacion', scores.motivacion),
    bienestarFinanciero: generateDimensionRecommendations('bienestarFinanciero', scores.bienestarFinanciero),
    equilibrioVidaTrabajo: generateDimensionRecommendations('equilibrioVidaTrabajo', scores.equilibrioVidaTrabajo),
    saludFisica: generateDimensionRecommendations('saludFisica', scores.saludFisica),
    conexionesSociales: generateDimensionRecommendations('conexionesSociales', scores.conexionesSociales),
    desarrolloProfesional: generateDimensionRecommendations('desarrolloProfesional', scores.desarrolloProfesional),
  };
};

const generateDimensionRecommendations = (dimension: string, score: number): string[] => {
  const recommendations = [];
  
  if (score < 60) {
    switch (dimension) {
      case 'vivienda':
        recommendations.push('Subsidio de arriendo o apoyo habitacional');
        recommendations.push('Asesoría en búsqueda de vivienda');
        break;
      case 'saludMental':
        recommendations.push('Apoyo psicológico especializado');
        recommendations.push('Programa de manejo del estrés');
        break;
      case 'motivacion':
        recommendations.push('Plan de desarrollo profesional');
        recommendations.push('Reconocimiento y feedback regular');
        break;
      case 'bienestarFinanciero':
        recommendations.push('Educación financiera');
        recommendations.push('Anticipos salariales o préstamos');
        break;
      case 'equilibrioVidaTrabajo':
        recommendations.push('Flexibilidad horaria');
        recommendations.push('Trabajo remoto parcial');
        break;
      case 'saludFisica':
        recommendations.push('Membresía gimnasio o actividades deportivas');
        recommendations.push('Chequeos médicos preventivos');
        break;
      case 'conexionesSociales':
        recommendations.push('Actividades de integración social');
        recommendations.push('Grupos de apoyo entre colegas');
        break;
      case 'desarrolloProfesional':
        recommendations.push('Capacitaciones especializadas');
        recommendations.push('Mentoring y coaching profesional');
        break;
    }
  }
  
  return recommendations;
};

const calculateOverallScore = (scores: any): number => {
  const values = Object.values(scores) as number[];
  return Math.round(values.reduce((sum, score) => sum + score, 0) / values.length);
};

const determinePriority = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'high';
  return 'critical';
};

const determineRiskLevel = (scores: any): 'low' | 'medium' | 'high' | 'critical' => {
  const values = Object.values(scores) as number[];
  const averageScore = values.reduce((sum, score) => sum + score, 0) / values.length;
  const criticalCount = values.filter(score => score < 40).length;
  
  if (criticalCount >= 3 || averageScore < 40) return 'critical';
  if (criticalCount >= 2 || averageScore < 60) return 'high';
  if (criticalCount >= 1 || averageScore < 75) return 'medium';
  return 'low';
};

const identifyPrimaryConcerns = (scores: any): string[] => {
  const concerns: string[] = [];
  const entries = Object.entries(scores) as [string, number][];
  
  entries
    .filter(([_, score]) => score < 60)
    .sort(([_, a], [__, b]) => a - b)
    .slice(0, 3)
    .forEach(([dimension, _]) => {
      concerns.push(dimension);
    });
  
  return concerns;
};

const identifyStrengths = (scores: any): string[] => {
  const strengths: string[] = [];
  const entries = Object.entries(scores) as [string, number][];
  
  entries
    .filter(([_, score]) => score >= 75)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3)
    .forEach(([dimension, _]) => {
      strengths.push(dimension);
    });
  
  return strengths;
}; 