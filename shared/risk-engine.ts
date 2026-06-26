// Shared risk calculation utilities for both client and server
export interface RiskFactors {
  familyHistory: number;
  lifestyle: number;
  environmental: number;
  age: number;
}

export interface RiskAssessmentResult {
  condition: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: RiskFactors;
  reasoning: string;
}

// Enhanced medical pedigree relationship definitions
export const FIRST_DEGREE_RELATIONS = [
  'father',
  'mother',
  'brother',
  'sister',
  'son',
  'daughter',
];

export const SECOND_DEGREE_RELATIONS = [
  'grandfather',
  'grandmother',
  'uncle',
  'aunt',
  'nephew',
  'niece',
  'half-brother',
  'half-sister',
  'grandson',
  'granddaughter',
];

export const THIRD_DEGREE_RELATIONS = [
  'great-grandfather',
  'great-grandmother',
  'great-uncle',
  'great-aunt',
  'first-cousin',
  'great-nephew',
  'great-niece',
  'great-grandson',
  'great-granddaughter',
];

// Enhanced health condition weights based on medical literature
export const CONDITION_WEIGHTS = {
  'Diabetes Type 2': {
    heritability: 0.72,
    firstDegree: 40,
    secondDegree: 20,
    thirdDegree: 8,
    ageOfOnsetMultiplier: {
      'early': 1.5,   // Before age 45
      'typical': 1.0, // Age 45-65
      'late': 0.7,    // After age 65
    },
    genderSpecificRisk: {
      'male': 1.1,
      'female': 1.0,
    },
  },
  'Heart Disease': {
    heritability: 0.57,
    firstDegree: 35,
    secondDegree: 18,
    thirdDegree: 7,
    ageOfOnsetMultiplier: {
      'early': 2.0,   // Before age 50
      'typical': 1.0, // Age 50-70
      'late': 0.6,    // After age 70
    },
    genderSpecificRisk: {
      'male': 1.2,
      'female': 1.0,
    },
  },
  'Breast Cancer': {
    heritability: 0.31,
    firstDegree: 45,
    secondDegree: 22,
    thirdDegree: 9,
    ageOfOnsetMultiplier: {
      'early': 2.5,   // Before age 40
      'typical': 1.0, // Age 40-60
      'late': 0.5,    // After age 60
    },
    genderSpecificRisk: {
      'male': 0.1,
      'female': 1.0,
    },
  },
  'Colon Cancer': {
    heritability: 0.45,
    firstDegree: 38,
    secondDegree: 19,
    thirdDegree: 8,
    ageOfOnsetMultiplier: {
      'early': 2.2,   // Before age 45
      'typical': 1.0, // Age 45-70
      'late': 0.6,    // After age 70
    },
    genderSpecificRisk: {
      'male': 1.1,
      'female': 1.0,
    },
  },
  'Alzheimer\'s Disease': {
    heritability: 0.79,
    firstDegree: 42,
    secondDegree: 21,
    thirdDegree: 8,
    ageOfOnsetMultiplier: {
      'early': 3.0,   // Before age 65
      'typical': 1.0, // Age 65-80
      'late': 0.7,    // After age 80
    },
    genderSpecificRisk: {
      'male': 0.8,
      'female': 1.0,
    },
  },
  'Hypertension': {
    heritability: 0.68,
    firstDegree: 30,
    secondDegree: 15,
    thirdDegree: 6,
    ageOfOnsetMultiplier: {
      'early': 1.8,
      'typical': 1.0,
      'late': 0.8,
    },
    genderSpecificRisk: {
      'male': 1.1,
      'female': 1.0,
    },
  },
  'Stroke': {
    heritability: 0.38,
    firstDegree: 32,
    secondDegree: 16,
    thirdDegree: 6,
    ageOfOnsetMultiplier: {
      'early': 2.5,
      'typical': 1.0,
      'late': 0.7,
    },
    genderSpecificRisk: {
      'male': 1.15,
      'female': 1.0,
    },
  },
  'Osteoporosis': {
    heritability: 0.85,
    firstDegree: 28,
    secondDegree: 14,
    thirdDegree: 5,
    ageOfOnsetMultiplier: {
      'early': 1.8,
      'typical': 1.0,
      'late': 1.2,
    },
    genderSpecificRisk: {
      'male': 0.3,
      'female': 1.0,
    },
  },
  'Depression': {
    heritability: 0.40,
    firstDegree: 25,
    secondDegree: 12,
    thirdDegree: 4,
    ageOfOnsetMultiplier: {
      'early': 1.5,
      'typical': 1.0,
      'late': 0.8,
    },
    genderSpecificRisk: {
      'male': 0.7,
      'female': 1.0,
    },
  },
  'Asthma': {
    heritability: 0.65,
    firstDegree: 35,
    secondDegree: 18,
    thirdDegree: 7,
    ageOfOnsetMultiplier: {
      'early': 1.3,
      'typical': 1.0,
      'late': 0.6,
    },
    genderSpecificRisk: {
      'male': 1.1,
      'female': 1.0,
    },
  },
};

// Medical condition validation and standardization
export const MEDICAL_CONDITION_CATEGORIES = {
  'Cardiovascular': [
    'Heart Disease', 'Hypertension', 'Stroke', 'Atrial Fibrillation', 'Coronary Artery Disease'
  ],
  'Metabolic': [
    'Diabetes Type 1', 'Diabetes Type 2', 'Obesity', 'Metabolic Syndrome', 'Thyroid Disease'
  ],
  'Cancer': [
    'Breast Cancer', 'Colon Cancer', 'Lung Cancer', 'Prostate Cancer', 'Ovarian Cancer'
  ],
  'Neurological': [
    'Alzheimer\'s Disease', 'Parkinson\'s Disease', 'Depression', 'Anxiety', 'Migraine'
  ],
  'Musculoskeletal': [
    'Osteoporosis', 'Arthritis', 'Osteoarthritis', 'Rheumatoid Arthritis'
  ],
  'Respiratory': [
    'Asthma', 'COPD', 'Chronic Bronchitis', 'Pulmonary Fibrosis'
  ],
};

export function getRelationshipDegree(relation: string): number {
  const lowerRelation = relation.toLowerCase();
  
  if (FIRST_DEGREE_RELATIONS.includes(lowerRelation)) return 1;
  if (SECOND_DEGREE_RELATIONS.includes(lowerRelation)) return 2;
  if (THIRD_DEGREE_RELATIONS.includes(lowerRelation)) return 3;
  
  return 4; // Fourth degree or more distant
}

export function classifyAgeOfOnset(condition: string, diagnosisAge: number): 'early' | 'typical' | 'late' {
  const weights = CONDITION_WEIGHTS[condition as keyof typeof CONDITION_WEIGHTS];
  if (!weights) return 'typical';
  
  switch (condition) {
    case 'Diabetes Type 2':
      if (diagnosisAge < 45) return 'early';
      if (diagnosisAge > 65) return 'late';
      return 'typical';
      
    case 'Heart Disease':
      if (diagnosisAge < 50) return 'early';
      if (diagnosisAge > 70) return 'late';
      return 'typical';
      
    case 'Breast Cancer':
      if (diagnosisAge < 40) return 'early';
      if (diagnosisAge > 60) return 'late';
      return 'typical';
      
    case 'Colon Cancer':
      if (diagnosisAge < 45) return 'early';
      if (diagnosisAge > 70) return 'late';
      return 'typical';
      
    case 'Alzheimer\'s Disease':
      if (diagnosisAge < 65) return 'early';
      if (diagnosisAge > 80) return 'late';
      return 'typical';
      
    default:
      return 'typical';
  }
}

export function standardizeMedicalCondition(condition: string): string {
  const normalized = condition.trim();
  
  const standardizations: Record<string, string> = {
    'diabetes': 'Diabetes Type 2',
    'diabetes type ii': 'Diabetes Type 2',
    'diabetes mellitus': 'Diabetes Type 2',
    'heart attack': 'Heart Disease',
    'myocardial infarction': 'Heart Disease',
    'high blood pressure': 'Hypertension',
    'depression': 'Depression',
    'alzheimer': 'Alzheimer\'s Disease',
    'alzheimers': 'Alzheimer\'s Disease',
    'breast ca': 'Breast Cancer',
    'colon ca': 'Colon Cancer',
    'stroke': 'Stroke',
    'cva': 'Stroke',
    'cerebrovascular accident': 'Stroke',
  };

  const lowerNormalized = normalized.toLowerCase();
  return standardizations[lowerNormalized] || normalized;
}

export function calculateConsanguinityRisk(familyMembers: any[], condition: string): number {
  let consanguinityScore = 0;
  
  // Check for multiple affected relatives in same lineage
  const paternalSide = familyMembers.filter(member => 
    ['father', 'grandfather', 'uncle'].includes(member.relation.toLowerCase()) &&
    member.medicalConditions?.includes(condition)
  );
  
  const maternalSide = familyMembers.filter(member => 
    ['mother', 'grandmother', 'aunt'].includes(member.relation.toLowerCase()) &&
    member.medicalConditions?.includes(condition)
  );
  
  if (paternalSide.length > 0 && maternalSide.length > 0) {
    consanguinityScore += 25;
  }
  
  const earlyOnsetRelatives = familyMembers.filter(member => {
    if (!member.medicalConditions?.includes(condition)) return false;
    if (!member.diagnosisAges || !member.diagnosisAges[condition]) return false;
    
    const diagnosisAge = member.diagnosisAges[condition];
    const onsetCategory = classifyAgeOfOnset(condition, diagnosisAge);
    return onsetCategory === 'early';
  });
  
  if (earlyOnsetRelatives.length >= 2) {
    consanguinityScore += 20;
  }
  
  return Math.min(consanguinityScore, 50);
}

export function calculateFamilyHistoryScore(
  condition: string,
  familyMembers: any[],
  userGender?: string
): number {
  const weights = CONDITION_WEIGHTS[condition as keyof typeof CONDITION_WEIGHTS];
  if (!weights) return 0;

  const affectedMembers = familyMembers.filter(member =>
    member.medicalConditions?.includes(condition)
  );

  if (affectedMembers.length === 0) return 0;

  let score = 0;

  for (const member of affectedMembers) {
    const degree = getRelationshipDegree(member.relation);
    let memberScore = 0;
    
    switch (degree) {
      case 1:
        memberScore = weights.firstDegree;
        break;
      case 2:
        memberScore = weights.secondDegree;
        break;
      case 3:
        memberScore = weights.thirdDegree || 5;
        break;
      default:
        memberScore = 2;
    }

    if (member.diagnosisAges && member.diagnosisAges[condition]) {
      const diagnosisAge = member.diagnosisAges[condition];
      const onsetCategory = classifyAgeOfOnset(condition, diagnosisAge);
      const multiplier = weights.ageOfOnsetMultiplier?.[onsetCategory] || 1.0;
      memberScore *= multiplier;
    }

    if (userGender && weights.genderSpecificRisk) {
      const genderMultiplier = weights.genderSpecificRisk[userGender as keyof typeof weights.genderSpecificRisk] || 1.0;
      memberScore *= genderMultiplier;
    }

    if (degree === 1 && affectedMembers.filter(m => getRelationshipDegree(m.relation) === 1).length > 1) {
      memberScore *= 1.2;
    }

    score += memberScore;
  }

  // Add consanguinity risk
  const consanguinityRisk = calculateConsanguinityRisk(familyMembers, condition);
  score += consanguinityRisk;

  score *= weights.heritability;
  return Math.min(score, 100);
}