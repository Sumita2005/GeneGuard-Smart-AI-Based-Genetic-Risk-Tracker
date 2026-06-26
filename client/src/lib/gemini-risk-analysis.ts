import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ 
  apiKey: typeof window !== 'undefined' 
    ? import.meta.env.VITE_GEMINI_API_KEY 
    : process.env.GEMINI_API_KEY || "" 
});

export interface EnhancedLifestyleFactors {
  smokingStatus: string;
  exerciseLevel: string;
  dietType: string;
  dietQuality: string;
  stressLevel: string;
  sleepQuality: string;
  alcoholConsumption: string;
  physicalActivity: string;
}

export interface GeminiRiskAnalysis {
  condition: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  factors: {
    familyHistory: number;
    lifestyle: number;
    environmental: number;
    age: number;
  };
  reasoning: string;
  recommendations: string[];
  insights: string;
}

export async function analyzeGeneticRisk(
  user: any,
  familyMembers: any[],
  condition: string
): Promise<GeminiRiskAnalysis> {
  try {
    const model = genAI.models.generateContent;

    const prompt = `
As a genetic counselor and health risk analyst, analyze the genetic risk for ${condition} based on the following data:

USER PROFILE:
- Age: ${user.age}
- Gender: ${user.gender}
- Medical Conditions: ${user.medicalConditions?.join(', ') || 'None'}
- Lifestyle Factors:
  - Smoking: ${user.lifestyle?.smokingStatus || 'Unknown'}
  - Exercise: ${user.lifestyle?.exerciseLevel || 'Unknown'}
  - Diet Type: ${user.lifestyle?.dietType || 'Unknown'}
  - Diet Quality: ${user.lifestyle?.dietQuality || 'Unknown'}
  - Stress Level: ${user.lifestyle?.stressLevel || 'Unknown'}
  - Sleep Quality: ${user.lifestyle?.sleepQuality || 'Unknown'}
  - Alcohol: ${user.lifestyle?.alcoholConsumption || 'Unknown'}

FAMILY HISTORY:
${familyMembers.map(member => `
- ${member.relation}: ${member.name}
  - Age: ${member.age || 'Unknown'}
  - Medical Conditions: ${member.medicalConditions?.join(', ') || 'None'}
  - Deceased: ${member.isDeceased ? 'Yes' : 'No'}
`).join('')}

Please provide a comprehensive risk analysis for ${condition} with:
1. Risk score (0-100)
2. Risk level (low/medium/high)
3. Confidence level (0-100)
4. Breakdown of contributing factors (familyHistory, lifestyle, environmental, age as percentages)
5. Evidence-based reasoning
6. Specific recommendations
7. Key insights

Respond in JSON format:
{
  "riskScore": number,
  "riskLevel": "low|medium|high",
  "confidence": number,
  "factors": {
    "familyHistory": number,
    "lifestyle": number,
    "environmental": number,
    "age": number
  },
  "reasoning": "detailed explanation",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "insights": "key insights and patterns"
}
`;

    const result = await model({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.text || "";
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      condition,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      confidence: analysis.confidence,
      factors: analysis.factors,
      reasoning: analysis.reasoning,
      recommendations: analysis.recommendations,
      insights: analysis.insights,
    };

  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Fallback to basic analysis if API fails
    return fallbackRiskAnalysis(user, familyMembers, condition);
  }
}

function fallbackRiskAnalysis(user: any, familyMembers: any[], condition: string): GeminiRiskAnalysis {
  const affectedMembers = familyMembers.filter(member =>
    member.medicalConditions?.includes(condition)
  );
  
  const familyHistoryScore = Math.min(affectedMembers.length * 25, 80);
  const lifestyleScore = calculateLifestyleRisk(user.lifestyle, condition);
  const ageScore = calculateAgeRisk(user.age, condition);
  
  const totalScore = Math.round(familyHistoryScore * 0.4 + lifestyleScore * 0.4 + ageScore * 0.2);
  
  return {
    condition,
    riskScore: totalScore,
    riskLevel: totalScore >= 70 ? 'high' : totalScore >= 40 ? 'medium' : 'low',
    confidence: 75,
    factors: {
      familyHistory: familyHistoryScore,
      lifestyle: lifestyleScore,
      environmental: 10,
      age: ageScore,
    },
    reasoning: `Risk assessment based on ${affectedMembers.length} affected family members, lifestyle factors, and age-related considerations.`,
    recommendations: [
      "Consult with healthcare provider for personalized screening recommendations",
      "Maintain healthy lifestyle habits including regular exercise and balanced diet",
      "Consider genetic counseling if family history is significant"
    ],
    insights: "Family history and lifestyle factors are primary contributors to your risk profile."
  };
}

function calculateLifestyleRisk(lifestyle: any, condition: string): number {
  if (!lifestyle) return 20;
  
  let risk = 0;
  
  // Smoking
  if (lifestyle.smokingStatus === 'current') risk += 25;
  else if (lifestyle.smokingStatus === 'former') risk += 10;
  
  // Exercise
  if (lifestyle.exerciseLevel === 'low') risk += 20;
  else if (lifestyle.exerciseLevel === 'moderate') risk += 5;
  
  // Diet quality
  if (lifestyle.dietQuality === 'poor') risk += 20;
  else if (lifestyle.dietQuality === 'fair') risk += 10;
  
  // Stress
  if (lifestyle.stressLevel === 'high') risk += 15;
  else if (lifestyle.stressLevel === 'moderate') risk += 5;
  
  return Math.min(risk, 80);
}

function calculateAgeRisk(age: string, condition: string): number {
  const numericAge = parseInt(age.split('-')[0]) || 30;
  
  const riskByCondition: Record<string, number[]> = {
    'Heart Disease': [45, 55, 65],
    'Diabetes Type 2': [35, 45, 55],
    'Breast Cancer': [40, 50, 60],
    'Colon Cancer': [45, 55, 65],
    'Alzheimer\'s Disease': [60, 70, 80],
  };
  
  const thresholds = riskByCondition[condition] || [50, 60, 70];
  
  if (numericAge >= thresholds[2]) return 30;
  if (numericAge >= thresholds[1]) return 20;
  if (numericAge >= thresholds[0]) return 10;
  
  return 0;
}