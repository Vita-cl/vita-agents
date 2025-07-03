import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface Benefit {
  id: string;
  name: string;
  category: string;
  description: string;
  provider: string;
  cost: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  targetDimensions: string[];
  eligibility: string[];
  implementation: string;
  timeToImpact: string;
  location?: string;
  tags: string[];
}

interface PersonalizedRecommendation {
  benefit: Benefit;
  relevanceScore: number;
  reasoning: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  expectedOutcome: string;
  implementationSteps: string[];
}

const BENEFITS_DATABASE: Benefit[] = [
  {
    id: 'subsidio-arriendo',
    name: 'Subsidio de Arriendo',
    category: 'vivienda',
    description: 'Apoyo económico mensual para gastos de arriendo',
    provider: 'Empresa',
    cost: 'high',
    impact: 'high',
    targetDimensions: ['vivienda', 'bienestarFinanciero'],
    eligibility: ['empleado-permanente'],
    implementation: 'Directo en nómina',
    timeToImpact: '1 mes',
    location: 'Chile',
    tags: ['financiero', 'habitacional', 'estabilidad'],
  },
  {
    id: 'apoyo-psicologico',
    name: 'Terapia Psicológica',
    category: 'saludMental',
    description: 'Sesiones gratuitas con psicólogos especializados',
    provider: 'Centro Médico UC',
    cost: 'medium',
    impact: 'high',
    targetDimensions: ['saludMental', 'equilibrioVidaTrabajo'],
    eligibility: ['todos'],
    implementation: 'Plataforma telemedicina',
    timeToImpact: '2 semanas',
    location: 'Chile',
    tags: ['mental', 'terapia', 'bienestar'],
  },
  {
    id: 'flexibilidad-horaria',
    name: 'Horario Flexible',
    category: 'equilibrioVidaTrabajo',
    description: 'Horarios adaptativos según necesidades personales',
    provider: 'Empresa',
    cost: 'low',
    impact: 'high',
    targetDimensions: ['equilibrioVidaTrabajo', 'motivacion'],
    eligibility: ['empleado-permanente'],
    implementation: 'Política interna',
    timeToImpact: 'Inmediato',
    location: 'Chile',
    tags: ['flexibilidad', 'familia', 'productividad'],
  },
  {
    id: 'seguro-salud-complementario',
    name: 'Seguro de Salud Premium',
    category: 'saludFisica',
    description: 'Cobertura médica extendida con especialistas',
    provider: 'Consalud',
    cost: 'high',
    impact: 'high',
    targetDimensions: ['saludFisica', 'bienestarFinanciero'],
    eligibility: ['empleado-permanente'],
    implementation: 'Afiliación automática',
    timeToImpact: '1 mes',
    location: 'Chile',
    tags: ['salud', 'medico', 'cobertura'],
  },
  {
    id: 'capacitacion-liderazgo',
    name: 'Programa de Liderazgo',
    category: 'desarrolloProfesional',
    description: 'Capacitación en habilidades directivas y liderazgo',
    provider: 'Universidad Católica',
    cost: 'medium',
    impact: 'high',
    targetDimensions: ['desarrolloProfesional', 'motivacion'],
    eligibility: ['supervisores', 'gerentes'],
    implementation: 'Modalidad virtual/presencial',
    timeToImpact: '3 meses',
    location: 'Chile',
    tags: ['capacitacion', 'liderazgo', 'carrera'],
  },
  {
    id: 'gimnasio-corporativo',
    name: 'Membresía SportLife',
    category: 'saludFisica',
    description: 'Acceso completo a cadena de gimnasios',
    provider: 'SportLife',
    cost: 'medium',
    impact: 'medium',
    targetDimensions: ['saludFisica', 'conexionesSociales'],
    eligibility: ['todos'],
    implementation: 'Credencial corporativa',
    timeToImpact: '1 semana',
    location: 'Santiago, Valparaíso, Concepción',
    tags: ['ejercicio', 'fitness', 'social'],
  },
  {
    id: 'educacion-financiera',
    name: 'Taller de Finanzas Personales',
    category: 'bienestarFinanciero',
    description: 'Capacitación en manejo de presupuesto y ahorros',
    provider: 'Banco de Chile',
    cost: 'low',
    impact: 'medium',
    targetDimensions: ['bienestarFinanciero'],
    eligibility: ['todos'],
    implementation: 'Talleres mensuales',
    timeToImpact: '2 meses',
    location: 'Chile',
    tags: ['finanzas', 'educacion', 'ahorros'],
  },
  {
    id: 'trabajo-remoto',
    name: 'Trabajo Remoto Híbrido',
    category: 'equilibrioVidaTrabajo',
    description: '2-3 días semanales de trabajo desde casa',
    provider: 'Empresa',
    cost: 'low',
    impact: 'high',
    targetDimensions: ['equilibrioVidaTrabajo', 'motivacion'],
    eligibility: ['roles-elegibles'],
    implementation: 'Política de trabajo híbrido',
    timeToImpact: 'Inmediato',
    location: 'Chile',
    tags: ['remoto', 'flexibilidad', 'familia'],
  },
  {
    id: 'seguro-vida-familiar',
    name: 'Seguro de Vida Familiar',
    category: 'bienestarFinanciero',
    description: 'Protección financiera para la familia',
    provider: 'MetLife',
    cost: 'medium',
    impact: 'medium',
    targetDimensions: ['bienestarFinanciero', 'conexionesSociales'],
    eligibility: ['empleado-permanente'],
    implementation: 'Afiliación automática',
    timeToImpact: '2 semanas',
    location: 'Chile',
    tags: ['seguro', 'familia', 'proteccion'],
  },
  {
    id: 'actividades-familiares',
    name: 'Eventos Familiares Corporativos',
    category: 'conexionesSociales',
    description: 'Actividades recreativas para empleados y familias',
    provider: 'Empresa',
    cost: 'medium',
    impact: 'medium',
    targetDimensions: ['conexionesSociales', 'equilibrioVidaTrabajo'],
    eligibility: ['todos'],
    implementation: 'Eventos mensuales',
    timeToImpact: '1 mes',
    location: 'Chile',
    tags: ['familia', 'recreacion', 'integracion'],
  },
  {
    id: 'mentoring-profesional',
    name: 'Programa de Mentoring',
    category: 'desarrolloProfesional',
    description: 'Acompañamiento personalizado para crecimiento profesional',
    provider: 'Empresa',
    cost: 'low',
    impact: 'high',
    targetDimensions: ['desarrolloProfesional', 'motivacion'],
    eligibility: ['todos'],
    implementation: 'Asignación de mentor interno',
    timeToImpact: '2 semanas',
    location: 'Chile',
    tags: ['mentoring', 'desarrollo', 'carrera'],
  },
  {
    id: 'checkup-medico',
    name: 'Chequeo Médico Preventivo',
    category: 'saludFisica',
    description: 'Exámenes médicos completos anuales',
    provider: 'Clínica Las Condes',
    cost: 'medium',
    impact: 'high',
    targetDimensions: ['saludFisica'],
    eligibility: ['empleado-permanente'],
    implementation: 'Programa anual',
    timeToImpact: '1 mes',
    location: 'Santiago, regiones',
    tags: ['preventivo', 'salud', 'examenes'],
  },
];

export const benefitRecommendationTool = createTool({
  id: 'recommend-benefits',
  description: 'Recomienda beneficios personalizados basados en la evaluación de bienestar',
  inputSchema: z.object({
    assessment: z.object({
      overallScore: z.number(),
      riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
      primaryConcerns: z.array(z.string()),
      strengths: z.array(z.string()),
      vivienda: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
      }),
      saludMental: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
      }),
      motivacion: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
      }),
      bienestarFinanciero: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
      }),
      equilibrioVidaTrabajo: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
      }),
      saludFisica: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
      }),
      conexionesSociales: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
      }),
      desarrolloProfesional: z.object({
        score: z.number(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
      }),
    }),
    employeeProfile: z.object({
      position: z.string().optional(),
      location: z.string().optional(),
      familyStatus: z.string().optional(),
      yearsInCompany: z.number().optional(),
    }).optional(),
    budget: z.enum(['low', 'medium', 'high']).optional(),
    urgentNeeds: z.array(z.string()).optional(),
  }),
  outputSchema: z.object({
    recommendations: z.array(z.object({
             benefit: z.object({
         id: z.string(),
         name: z.string(),
         category: z.string(),
         description: z.string(),
         provider: z.string(),
         cost: z.enum(['low', 'medium', 'high']),
         impact: z.enum(['low', 'medium', 'high']),
         targetDimensions: z.array(z.string()),
         eligibility: z.array(z.string()),
         implementation: z.string(),
         timeToImpact: z.string(),
         location: z.string().optional(),
         tags: z.array(z.string()),
       }),
      relevanceScore: z.number(),
      reasoning: z.string(),
      urgency: z.enum(['low', 'medium', 'high', 'critical']),
      expectedOutcome: z.string(),
      implementationSteps: z.array(z.string()),
    })),
    summary: z.object({
      totalBenefits: z.number(),
      priorityDistribution: z.object({
        critical: z.number(),
        high: z.number(),
        medium: z.number(),
        low: z.number(),
      }),
      estimatedImpact: z.string(),
      implementationTimeline: z.string(),
      budgetConsiderations: z.string(),
    }),
  }),
  execute: async ({ context }) => {
    const { assessment, employeeProfile, budget = 'medium', urgentNeeds = [] } = context;
    
    const recommendations = await generatePersonalizedRecommendations(
      assessment,
      employeeProfile,
      budget,
      urgentNeeds
    );
    
    const summary = generateRecommendationSummary(recommendations);
    
    return {
      recommendations,
      summary,
    };
  },
});

const generatePersonalizedRecommendations = async (
  assessment: any,
  employeeProfile?: any,
  budget: string = 'medium',
  urgentNeeds: string[] = []
): Promise<PersonalizedRecommendation[]> => {
  const recommendations: PersonalizedRecommendation[] = [];
  
  const dimensionScores = {
    vivienda: assessment.vivienda,
    saludMental: assessment.saludMental,
    motivacion: assessment.motivacion,
    bienestarFinanciero: assessment.bienestarFinanciero,
    equilibrioVidaTrabajo: assessment.equilibrioVidaTrabajo,
    saludFisica: assessment.saludFisica,
    conexionesSociales: assessment.conexionesSociales,
    desarrolloProfesional: assessment.desarrolloProfesional,
  };
  
  for (const benefit of BENEFITS_DATABASE) {
    const relevanceScore = calculateRelevanceScore(benefit, dimensionScores, employeeProfile, urgentNeeds);
    
    if (relevanceScore > 0.3) {
      const recommendation: PersonalizedRecommendation = {
        benefit: {
          id: benefit.id,
          name: benefit.name,
          category: benefit.category,
          description: benefit.description,
          provider: benefit.provider,
          cost: benefit.cost,
          impact: benefit.impact,
          targetDimensions: benefit.targetDimensions,
          eligibility: benefit.eligibility,
          implementation: benefit.implementation,
          timeToImpact: benefit.timeToImpact,
          location: benefit.location,
          tags: benefit.tags,
        },
        relevanceScore: Math.round(relevanceScore * 100),
        reasoning: generateReasoning(benefit, dimensionScores, urgentNeeds),
        urgency: determineUrgency(benefit, dimensionScores, urgentNeeds),
        expectedOutcome: generateExpectedOutcome(benefit, dimensionScores),
        implementationSteps: generateImplementationSteps(benefit, employeeProfile),
      };
      
      recommendations.push(recommendation);
    }
  }
  
  return recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8);
};

const calculateRelevanceScore = (
  benefit: Benefit,
  dimensionScores: any,
  employeeProfile?: any,
  urgentNeeds: string[] = []
): number => {
  let score = 0;
  let maxScore = 0;
  
  for (const dimension of benefit.targetDimensions) {
    const dimensionData = dimensionScores[dimension];
    if (dimensionData) {
      maxScore += 1;
      
      if (dimensionData.score < 60) {
        score += 0.8;
        
        if (dimensionData.priority === 'critical') score += 0.4;
        else if (dimensionData.priority === 'high') score += 0.3;
        else if (dimensionData.priority === 'medium') score += 0.2;
      } else if (dimensionData.score < 75) {
        score += 0.4;
      } else {
        score += 0.1;
      }
      
      if (urgentNeeds.includes(dimension)) {
        score += 0.5;
      }
    }
  }
  
  if (maxScore === 0) return 0;
  
  let finalScore = score / maxScore;
  
  if (employeeProfile?.location && benefit.location && 
      benefit.location.includes(employeeProfile.location)) {
    finalScore += 0.1;
  }
  
  if (employeeProfile?.position) {
    if (benefit.eligibility.includes('todos') || 
        benefit.eligibility.some(req => employeeProfile.position.toLowerCase().includes(req))) {
      finalScore += 0.1;
    }
  }
  
  return Math.min(1, finalScore);
};

const generateReasoning = (
  benefit: Benefit,
  dimensionScores: any,
  urgentNeeds: string[]
): string => {
  const lowScoreDimensions = benefit.targetDimensions.filter(dim => 
    dimensionScores[dim] && dimensionScores[dim].score < 60
  );
  
  const urgentDimensions = benefit.targetDimensions.filter(dim => 
    urgentNeeds.includes(dim)
  );
  
  if (urgentDimensions.length > 0) {
    return `Este beneficio aborda necesidades urgentes identificadas en ${urgentDimensions.join(', ')}.`;
  }
  
  if (lowScoreDimensions.length > 0) {
    return `Recomendado para mejorar ${lowScoreDimensions.join(' y ')} que muestran puntuaciones bajas.`;
  }
  
  return `Beneficio complementario que puede fortalecer ${benefit.targetDimensions.join(' y ')}.`;
};

const determineUrgency = (
  benefit: Benefit,
  dimensionScores: any,
  urgentNeeds: string[]
): 'low' | 'medium' | 'high' | 'critical' => {
  const criticalDimensions = benefit.targetDimensions.filter(dim => 
    dimensionScores[dim] && dimensionScores[dim].priority === 'critical'
  );
  
  const urgentDimensions = benefit.targetDimensions.filter(dim => 
    urgentNeeds.includes(dim)
  );
  
  if (criticalDimensions.length > 0 || urgentDimensions.length > 0) {
    return 'critical';
  }
  
  const highPriorityDimensions = benefit.targetDimensions.filter(dim => 
    dimensionScores[dim] && dimensionScores[dim].priority === 'high'
  );
  
  if (highPriorityDimensions.length > 0) {
    return 'high';
  }
  
  const mediumPriorityDimensions = benefit.targetDimensions.filter(dim => 
    dimensionScores[dim] && dimensionScores[dim].priority === 'medium'
  );
  
  if (mediumPriorityDimensions.length > 0) {
    return 'medium';
  }
  
  return 'low';
};

const generateExpectedOutcome = (
  benefit: Benefit,
  dimensionScores: any
): string => {
  const lowDimensions = benefit.targetDimensions.filter(dim => 
    dimensionScores[dim] && dimensionScores[dim].score < 60
  );
  
  if (lowDimensions.length > 0) {
    return `Se espera una mejora del 15-30% en ${lowDimensions.join(' y ')} en los próximos ${benefit.timeToImpact}.`;
  }
  
  return `Contribuirá al mantenimiento y mejora gradual del bienestar general.`;
};

const generateImplementationSteps = (
  benefit: Benefit,
  employeeProfile?: any
): string[] => {
  const steps = [];
  
  switch (benefit.category) {
    case 'vivienda':
      steps.push('Completar formulario de solicitud de subsidio');
      steps.push('Presentar documentación de gastos de arriendo');
      steps.push('Revisión y aprobación por área de Recursos Humanos');
      break;
      
    case 'saludMental':
      steps.push('Agendar cita inicial con psicólogo asignado');
      steps.push('Completar evaluación psicológica inicial');
      steps.push('Definir plan de sesiones según necesidades');
      break;
      
    case 'equilibrioVidaTrabajo':
      steps.push('Solicitar reunión con supervisor directo');
      steps.push('Proponer horario flexible según necesidades');
      steps.push('Firmar acuerdo de modalidad de trabajo');
      break;
      
    case 'saludFisica':
      steps.push('Registrarse en plataforma del proveedor');
      steps.push('Agendar chequeo médico inicial');
      steps.push('Recibir credencial de acceso');
      break;
      
    case 'desarrolloProfesional':
      steps.push('Inscribirse en programa de capacitación');
      steps.push('Completar evaluación de competencias inicial');
      steps.push('Asistir a sesiones programadas');
      break;
      
    default:
      steps.push('Revisar información detallada del beneficio');
      steps.push('Contactar a Recursos Humanos para activación');
      steps.push('Completar proceso de inscripción');
  }
  
  return steps;
};

const generateRecommendationSummary = (recommendations: PersonalizedRecommendation[]) => {
  const priorityDistribution = {
    critical: recommendations.filter(r => r.urgency === 'critical').length,
    high: recommendations.filter(r => r.urgency === 'high').length,
    medium: recommendations.filter(r => r.urgency === 'medium').length,
    low: recommendations.filter(r => r.urgency === 'low').length,
  };
  
  const highImpactBenefits = recommendations.filter(r => r.benefit.impact === 'high').length;
  const criticalUrgencyBenefits = recommendations.filter(r => r.urgency === 'critical').length;
  
  let estimatedImpact = 'Mejora gradual del bienestar general';
  if (criticalUrgencyBenefits > 2) {
    estimatedImpact = 'Impacto significativo esperado en 2-3 meses';
  } else if (highImpactBenefits > 3) {
    estimatedImpact = 'Mejora notable esperada en 3-6 meses';
  }
  
  let implementationTimeline = '3-6 meses para implementación completa';
  if (criticalUrgencyBenefits > 0) {
    implementationTimeline = 'Inicio inmediato recomendado para beneficios críticos';
  }
  
  const highCostBenefits = recommendations.filter(r => r.benefit.cost === 'high').length;
  let budgetConsiderations = 'Presupuesto moderado requerido';
  if (highCostBenefits > 2) {
    budgetConsiderations = 'Inversión significativa pero con alto retorno esperado';
  } else if (highCostBenefits === 0) {
    budgetConsiderations = 'Implementación de bajo costo';
  }
  
  return {
    totalBenefits: recommendations.length,
    priorityDistribution,
    estimatedImpact,
    implementationTimeline,
    budgetConsiderations,
  };
}; 