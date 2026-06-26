import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertFamilyMemberSchema,
  insertRiskAssessmentSchema,
  insertRecommendationSchema,
  insertHealthPassportSchema,
  insertChatMessageSchema,
} from "@shared/schema";
import { calculateFamilyHistoryScore, standardizeMedicalCondition } from "@shared/risk-engine";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Family member routes
  app.get("/api/users/:userId/family-members", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const familyMembers = await storage.getFamilyMembers(userId);
      res.json(familyMembers);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/family-members", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const memberData = insertFamilyMemberSchema.parse({
        ...req.body,
        userId,
      });
      const member = await storage.createFamilyMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid family member data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/family-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertFamilyMemberSchema.partial().parse(req.body);
      const member = await storage.updateFamilyMember(id, updates);
      if (!member) {
        return res.status(404).json({ message: "Family member not found" });
      }
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/family-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFamilyMember(id);
      if (!deleted) {
        return res.status(404).json({ message: "Family member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Health conditions
  app.get("/api/health-conditions", async (req, res) => {
    try {
      const conditions = await storage.getHealthConditions();
      res.json(conditions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Risk assessment routes
  app.get("/api/users/:userId/risk-assessments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const assessments = await storage.getRiskAssessments(userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/calculate-risks", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user and family data
      const user = await storage.getUser(userId);
      const familyMembers = await storage.getFamilyMembers(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Calculate risks using our risk engine
      const riskCalculations = calculateGeneticRisks(user, familyMembers);
      
      // Save risk assessments
      const assessments = await storage.updateRiskAssessments(userId, riskCalculations);
      
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Recommendations routes
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recommendations = await storage.getRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/generate-recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get risk assessments
      const riskAssessments = await storage.getRiskAssessments(userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate recommendations based on risks
      const recommendations = generateHealthRecommendations(user, riskAssessments);
      
      // Save recommendations
      const savedRecommendations = [];
      for (const rec of recommendations) {
        const saved = await storage.createRecommendation(rec);
        savedRecommendations.push(saved);
      }
      
      res.json(savedRecommendations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/recommendations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertRecommendationSchema.partial().parse(req.body);
      const recommendation = await storage.updateRecommendation(id, updates);
      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      res.json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Health passport routes
  app.get("/api/users/:userId/health-passport", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const passport = await storage.getHealthPassport(userId);
      res.json(passport);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/health-passport", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const passportId = `GG-${userId}-${Date.now()}`;
      
      const passportData = insertHealthPassportSchema.parse({
        userId,
        passportId,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${process.env.REPLIT_DOMAINS || 'localhost:5000'}/passport/${passportId}`)}`,
        shareableLink: `${process.env.REPLIT_DOMAINS || 'localhost:5000'}/passport/${passportId}`,
      });
      
      const passport = await storage.createHealthPassport(passportData);
      res.status(201).json(passport);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid passport data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/passport/:passportId", async (req, res) => {
    try {
      const passportId = req.params.passportId;
      const passport = await storage.getHealthPassportByPassportId(passportId);
      
      if (!passport) {
        return res.status(404).json({ message: "Health passport not found" });
      }
      
      // Get full user data for passport
      const user = await storage.getUser(passport.userId);
      const familyMembers = await storage.getFamilyMembers(passport.userId);
      const riskAssessments = await storage.getRiskAssessments(passport.userId);
      const recommendations = await storage.getRecommendations(passport.userId);
      
      res.json({
        passport,
        user,
        familyMembers,
        riskAssessments,
        recommendations,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chat routes
  app.get("/api/users/:userId/chat-messages", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/chat", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Generate AI response
      const response = generateAIResponse(message, userId);
      
      const chatMessage = await storage.createChatMessage({
        userId,
        message,
        response,
      });
      
      res.json(chatMessage);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Enhanced risk calculation engine with comprehensive condition analysis
function calculateGeneticRisks(user: any, familyMembers: any[]): any[] {
  
  const conditions = [
    "Diabetes Type 2", 
    "Heart Disease", 
    "Breast Cancer", 
    "Colon Cancer", 
    "Alzheimer's Disease",
    "Hypertension",
    "Stroke",
    "Osteoporosis",
    "Depression",
    "Asthma"
  ];
  const assessments = [];

  // Standardize medical conditions in family members
  const standardizedFamilyMembers = familyMembers.map(member => ({
    ...member,
    medicalConditions: member.medicalConditions?.map((condition: string) => 
      standardizeMedicalCondition(condition)
    ) || []
  }));

  for (const condition of conditions) {
    let riskScore = 0;
    let familyHistoryFactor = 0;
    let lifestyleFactor = 0;
    let environmentalFactor = 0;
    let ageFactor = 0;

    // Enhanced family history analysis using shared algorithms
    familyHistoryFactor = calculateFamilyHistoryScore(condition, standardizedFamilyMembers, user.gender);

    // Lifestyle factors
    if (user.lifestyle) {
      if (condition === "Diabetes Type 2") {
        if (user.lifestyle.exerciseLevel === 'low') lifestyleFactor += 20;
        if (user.lifestyle.smokingStatus === 'current') lifestyleFactor += 15;
        if (user.lifestyle.dietType === 'processed') lifestyleFactor += 25;
      } else if (condition === "Heart Disease") {
        if (user.lifestyle.smokingStatus === 'current') lifestyleFactor += 30;
        if (user.lifestyle.exerciseLevel === 'low') lifestyleFactor += 20;
      } else if (condition === "Breast Cancer" && user.gender === 'female') {
        // Age and lifestyle factors for breast cancer
        const age = parseInt(user.age.split('-')[0]);
        if (age > 40) ageFactor += 15;
        if (age > 50) ageFactor += 10;
      }
    }

    // Environmental factors (simplified)
    environmentalFactor = 10; // Base environmental risk

    // Age factors
    const age = parseInt(user.age.split('-')[0]);
    if (condition === "Alzheimer's Disease" && age > 60) {
      ageFactor += 25;
    }

    // Calculate total risk score
    riskScore = Math.min(100, familyHistoryFactor + lifestyleFactor + environmentalFactor + ageFactor);
    
    let riskLevel = 'low';
    if (riskScore >= 70) riskLevel = 'high';
    else if (riskScore >= 40) riskLevel = 'medium';

    // Generate reasoning
    let reasoning = `Risk assessment based on: `;
    const factors = [];
    if (familyHistoryFactor > 0) {
      const affectedCount = familyMembers.filter(member => 
        member.medicalConditions?.includes(condition)
      ).length;
      factors.push(`family history (${affectedCount} affected relative${affectedCount > 1 ? 's' : ''})`);
    }
    if (lifestyleFactor > 0) factors.push(`lifestyle factors`);
    if (ageFactor > 0) factors.push(`age-related factors`);
    reasoning += factors.join(', ');

    assessments.push({
      userId: user.id,
      condition,
      riskScore,
      riskLevel,
      factors: {
        familyHistory: familyHistoryFactor,
        lifestyle: lifestyleFactor,
        environmental: environmentalFactor,
        age: ageFactor,
      },
      reasoning,
    });
  }

  return assessments;
}

// Health recommendations generator
function generateHealthRecommendations(user: any, riskAssessments: any[]): any[] {
  const recommendations = [];

  for (const assessment of riskAssessments) {
    if (assessment.riskLevel === 'high') {
      // High-priority recommendations
      if (assessment.condition === "Diabetes Type 2") {
        recommendations.push({
          userId: user.id,
          type: "screening",
          title: "Schedule diabetes screening",
          description: "Get HbA1c and glucose tolerance tests due to high family history",
          priority: "high",
          category: "Preventive Care",
          dueDate: "Next 30 days",
          relatedCondition: assessment.condition,
        });
        
        recommendations.push({
          userId: user.id,
          type: "consultation",
          title: "Endocrinologist consultation",
          description: "Discuss diabetes prevention strategies and metabolic health",
          priority: "medium",
          category: "Specialist Care",
          dueDate: "Next 60 days",
          relatedCondition: assessment.condition,
        });
      }
      
      if (assessment.condition === "Breast Cancer" && user.gender === 'female') {
        recommendations.push({
          userId: user.id,
          type: "consultation",
          title: "Genetic counseling consultation",
          description: "Discuss BRCA testing due to family cancer history",
          priority: "high",
          category: "Genetic Testing",
          dueDate: "Next 60 days",
          relatedCondition: assessment.condition,
        });
        
        recommendations.push({
          userId: user.id,
          type: "screening",
          title: "Enhanced breast cancer screening",
          description: "Annual mammography and consider MRI screening",
          priority: "high",
          category: "Cancer Screening",
          dueDate: "Annually",
          relatedCondition: assessment.condition,
        });
      }
    }
    
    if (assessment.riskLevel === 'medium') {
      // Medium-priority lifestyle recommendations
      recommendations.push({
        userId: user.id,
        type: "lifestyle",
        title: `${assessment.condition} prevention plan`,
        description: `Lifestyle modifications to reduce your ${assessment.condition.toLowerCase()} risk`,
        priority: "medium",
        category: "Lifestyle",
        dueDate: "Ongoing",
        relatedCondition: assessment.condition,
      });
    }
  }

  // General lifestyle recommendations
  if (user.lifestyle?.exerciseLevel === 'low') {
    recommendations.push({
      userId: user.id,
      type: "lifestyle",
      title: "Increase physical activity",
      description: "Add 150 minutes of moderate cardio weekly and strength training 2x per week",
      priority: "medium",
      category: "Exercise",
      dueDate: "Ongoing",
      relatedCondition: null,
    });
  }

  if (user.lifestyle?.smokingStatus === 'current') {
    recommendations.push({
      userId: user.id,
      type: "lifestyle",
      title: "Smoking cessation program",
      description: "Join a smoking cessation program to significantly reduce health risks",
      priority: "high",
      category: "Lifestyle",
      dueDate: "Immediate",
      relatedCondition: null,
    });
  }

  return recommendations;
}

// AI response generator
function generateAIResponse(message: string, userId: number): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('diabetes') || lowerMessage.includes('blood sugar')) {
    return "Based on your family history, you have an elevated risk for diabetes. I recommend regular monitoring with HbA1c tests every 6 months, maintaining a healthy diet low in refined sugars, and staying physically active. Would you like specific dietary recommendations?";
  }
  
  if (lowerMessage.includes('cancer') || lowerMessage.includes('breast')) {
    return "Your family history of cancer suggests genetic counseling would be beneficial. Early detection through regular screening is crucial. I recommend discussing BRCA testing with a genetic counselor and maintaining annual mammograms. Shall I help you find local genetic counselors?";
  }
  
  if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
    return "Regular exercise is one of the best ways to reduce genetic disease risks. I recommend 150 minutes of moderate cardio weekly plus strength training 2x per week. Start gradually and consider consulting a fitness professional for a personalized plan.";
  }
  
  if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition')) {
    return "A healthy diet can significantly impact your genetic risk profile. Focus on whole foods, lean proteins, high-fiber vegetables, and limit processed foods. For diabetes prevention, particularly watch refined sugar intake. Would you like me to suggest specific meal planning resources?";
  }
  
  if (lowerMessage.includes('screening') || lowerMessage.includes('test')) {
    return "Based on your risk profile, here are your recommended screenings: Diabetes screening every 6 months, cardiovascular check every 2 years, cancer screenings as appropriate for your age and risk factors. Shall I provide more details on any specific screening?";
  }
  
  if (lowerMessage.includes('family') || lowerMessage.includes('relatives')) {
    return "Your family medical history is a key factor in your risk assessment. The more detailed information you can provide about relatives' health conditions and age of diagnosis, the more accurate your risk predictions will be. Consider reaching out to family members to gather more health history.";
  }
  
  // Default responses
  const defaultResponses = [
    "I'm here to help with your health questions. You can ask me about your genetic risks, lifestyle recommendations, screening schedules, or any health concerns you might have.",
    "Based on your health profile, I can provide personalized advice about risk reduction strategies. What specific aspect of your health would you like to discuss?",
    "I can help explain your risk assessments, suggest lifestyle modifications, or provide information about recommended screenings. What would you like to know more about?",
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
