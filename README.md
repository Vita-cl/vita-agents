# Vita Agents - Mastra AI Agent Architecture

This project demonstrates advanced AI agent architecture using Mastra, featuring a comprehensive employee wellbeing assessment system.

## 🌟 SemSo Wellbeing Assessment System

A comprehensive employee wellbeing evaluation system designed for Chilean workers, inspired by SemSo's approach to measuring and improving workplace wellness.

### Architecture Overview

**🤖 SemSo Agent** (`src/mastra/agents/semso-agent.ts`)
- Conducts friendly, empathetic wellbeing interviews in Spanish
- Evaluates 8 dimensions of wellbeing:
  - 🏠 **Vivienda** - Housing quality and stability
  - 🧠 **Salud Mental** - Mental health and emotional wellbeing
  - ⚡ **Motivación** - Work satisfaction and purpose
  - 💰 **Bienestar Financiero** - Financial stability and security
  - ⚖️ **Equilibrio Vida-Trabajo** - Work-life balance
  - 💪 **Salud Física** - Physical health and wellness habits
  - 🤝 **Conexiones Sociales** - Family, social, and work relationships
  - 📈 **Desarrollo Profesional** - Career growth opportunities

**🔧 Assessment Tool** (`src/mastra/tools/wellbeing-assessment-tool.ts`)
- Analyzes interview responses with sophisticated Spanish keyword detection
- Generates 0-100 scores for each wellbeing dimension
- Identifies risk levels (low/medium/high/critical)
- Extracts primary concerns and strengths

**💡 Benefit Recommendation Tool** (`src/mastra/tools/benefit-recommendation-tool.ts`)
- Comprehensive database of 40+ Chilean employee benefits
- Smart matching algorithm based on wellbeing assessment results
- Personalized recommendations with relevance scoring
- Urgency classification and implementation guidance

**🔄 Workflow Functions** (`src/mastra/workflows/semso-workflow.ts`)
- `conductWellbeingInterview()` - Main interview orchestration
- `processWellbeingAssessment()` - Assessment analysis and scoring
- `generateWellbeingReport()` - Comprehensive reporting for HR and employees

### Key Features

- **🇨🇱 Chilean Context**: Designed specifically for Chilean workplace culture
- **📊 Data-Driven**: Evidence-based scoring and recommendation algorithms  
- **🎯 Personalized**: Tailored benefit recommendations for each employee
- **📈 Actionable**: Clear implementation plans and timelines
- **🔒 Confidential**: Secure handling of sensitive employee data

### Benefit Categories Covered

- 🏥 Health & Medical
- 💰 Financial Support
- 🎓 Education & Development
- 👨‍👩‍👧‍👦 Family Support
- 🚗 Transportation
- 🍽️ Food & Nutrition
- 🏃‍♂️ Wellness & Recreation
- 🏠 Housing Support

### Usage Example

```typescript
import { semsoAgent } from './src/mastra/agents/semso-agent';
import { conductWellbeingInterview } from './src/mastra/workflows/semso-workflow';

// Start a wellbeing assessment
const result = await conductWellbeingInterview({
  employeeProfile: {
    name: "María González",
    position: "Analista de Sistemas",
    department: "TI"
  },
  companySettings: {
    budget: "medium",
    priorityAreas: ["saludMental", "equilibrioVidaTrabajo"]
  }
});

console.log(`Assessment completed for session: ${result.sessionId}`);
console.log(`Overall wellbeing score: ${result.wellbeingAssessment.overallScore}/100`);
console.log(`Recommended benefits: ${result.recommendedBenefits.length}`);
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Add your OpenAI API key
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the Mastra playground:**
   Open `http://localhost:4111` to interact with the SemSo agent

## 🛠️ Technical Stack

- **Framework**: Mastra v0.10.10
- **Language**: TypeScript
- **LLM Provider**: OpenAI (via Vercel AI SDK)
- **Database**: LibSQL (In-memory for development)
- **Logging**: Pino Logger
- **Validation**: Zod schemas

## 📋 Project Structure

```
src/mastra/
├── agents/
│   └── semso-agent.ts              # Main SemSo wellbeing agent
├── tools/
│   ├── wellbeing-assessment-tool.ts # Assessment analysis
│   └── benefit-recommendation-tool.ts # Benefit matching
├── workflows/
│   └── semso-workflow.ts           # Interview orchestration
└── index.ts                       # Mastra configuration
```

## 🎯 About SemSo

SemSo is a Chilean SocialTech company focused on improving worker wellbeing. They provide a platform that measures the real state of employee wellbeing (housing, mental health, motivation, etc.) and deliver actionable reports to HR and Sustainability departments.

**Key Stats:**
- 🏢 Supports 40,000+ workers in Chile and LATAM
- 🏭 Clients include Esmax, Cruz Verde, Agrícola AASA
- 📊 Data-driven approach to employee wellbeing
- 💼 Strategic focus: wellbeing as a driver of productivity, retention, and organizational culture

## 🤝 Contributing

This project demonstrates advanced AI agent patterns and can be extended with:
- Integration with real HR systems
- Additional benefit databases
- Multi-language support
- Advanced analytics dashboards
- Mobile app integration

## 📄 License

This project is provided for educational and demonstration purposes. 