import {
  users,
  familyMembers,
  healthConditions,
  riskAssessments,
  recommendations,
  healthPassports,
  chatMessages,
  type User,
  type InsertUser,
  type FamilyMember,
  type InsertFamilyMember,
  type HealthCondition,
  type RiskAssessment,
  type InsertRiskAssessment,
  type Recommendation,
  type InsertRecommendation,
  type HealthPassport,
  type InsertHealthPassport,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Family member operations
  getFamilyMembers(userId: number): Promise<FamilyMember[]>;
  getFamilyMember(id: number): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: number, updates: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined>;
  deleteFamilyMember(id: number): Promise<boolean>;
  
  // Health conditions
  getHealthConditions(): Promise<HealthCondition[]>;
  
  // Risk assessments
  getRiskAssessments(userId: number): Promise<RiskAssessment[]>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;
  updateRiskAssessments(userId: number, assessments: InsertRiskAssessment[]): Promise<RiskAssessment[]>;
  
  // Recommendations
  getRecommendations(userId: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  updateRecommendation(id: number, updates: Partial<InsertRecommendation>): Promise<Recommendation | undefined>;
  
  // Health passports
  getHealthPassport(userId: number): Promise<HealthPassport | undefined>;
  createHealthPassport(passport: InsertHealthPassport): Promise<HealthPassport>;
  getHealthPassportByPassportId(passportId: string): Promise<HealthPassport | undefined>;
  
  // Chat messages
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private familyMembers: Map<number, FamilyMember>;
  private healthConditions: HealthCondition[];
  private riskAssessments: Map<number, RiskAssessment>;
  private recommendations: Map<number, Recommendation>;
  private healthPassports: Map<number, HealthPassport>;
  private chatMessages: Map<number, ChatMessage>;
  private currentUserId: number;
  private currentFamilyMemberId: number;
  private currentRiskAssessmentId: number;
  private currentRecommendationId: number;
  private currentHealthPassportId: number;
  private currentChatMessageId: number;

  constructor() {
    this.users = new Map();
    this.familyMembers = new Map();
    this.riskAssessments = new Map();
    this.recommendations = new Map();
    this.healthPassports = new Map();
    this.chatMessages = new Map();
    this.currentUserId = 1;
    this.currentFamilyMemberId = 1;
    this.currentRiskAssessmentId = 1;
    this.currentRecommendationId = 1;
    this.currentHealthPassportId = 1;
    this.currentChatMessageId = 1;

    // Initialize health conditions
    this.healthConditions = [
      { id: 1, name: "Diabetes Type 2", category: "Metabolic", heritabilityFactor: 70, description: "Type 2 diabetes mellitus" },
      { id: 2, name: "Heart Disease", category: "Cardiovascular", heritabilityFactor: 50, description: "Coronary heart disease" },
      { id: 3, name: "Breast Cancer", category: "Cancer", heritabilityFactor: 25, description: "Breast cancer" },
      { id: 4, name: "Colon Cancer", category: "Cancer", heritabilityFactor: 35, description: "Colorectal cancer" },
      { id: 5, name: "Alzheimer's Disease", category: "Neurological", heritabilityFactor: 60, description: "Alzheimer's disease and dementia" },
      { id: 6, name: "High Blood Pressure", category: "Cardiovascular", heritabilityFactor: 40, description: "Hypertension" },
      { id: 7, name: "Stroke", category: "Cardiovascular", heritabilityFactor: 45, description: "Cerebrovascular accident" },
      { id: 8, name: "Osteoporosis", category: "Musculoskeletal", heritabilityFactor: 60, description: "Bone density loss" },
    ];
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      ...updates,
      lifestyle: updates.lifestyle ? {
        smokingStatus: updates.lifestyle.smokingStatus as string,
        exerciseLevel: updates.lifestyle.exerciseLevel as string,
        dietType: updates.lifestyle.dietType as string,
        stressLevel: updates.lifestyle.stressLevel as string | undefined,
        sleepQuality: updates.lifestyle.sleepQuality as string | undefined,
      } : user.lifestyle
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Family member operations
  async getFamilyMembers(userId: number): Promise<FamilyMember[]> {
    return Array.from(this.familyMembers.values()).filter(member => member.userId === userId);
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    return this.familyMembers.get(id);
  }

  async createFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const id = this.currentFamilyMemberId++;
    const member: FamilyMember = {
      ...insertMember,
      id,
      createdAt: new Date(),
    };
    this.familyMembers.set(id, member);
    return member;
  }

  async updateFamilyMember(id: number, updates: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined> {
    const member = this.familyMembers.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...updates };
    this.familyMembers.set(id, updatedMember);
    return updatedMember;
  }

  async deleteFamilyMember(id: number): Promise<boolean> {
    return this.familyMembers.delete(id);
  }

  // Health conditions
  async getHealthConditions(): Promise<HealthCondition[]> {
    return this.healthConditions;
  }

  // Risk assessments
  async getRiskAssessments(userId: number): Promise<RiskAssessment[]> {
    return Array.from(this.riskAssessments.values()).filter(assessment => assessment.userId === userId);
  }

  async createRiskAssessment(insertAssessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const id = this.currentRiskAssessmentId++;
    const assessment: RiskAssessment = {
      ...insertAssessment,
      id,
      lastUpdated: new Date(),
    };
    this.riskAssessments.set(id, assessment);
    return assessment;
  }

  async updateRiskAssessments(userId: number, assessments: InsertRiskAssessment[]): Promise<RiskAssessment[]> {
    // Remove existing assessments for this user
    Array.from(this.riskAssessments.entries()).forEach(([id, assessment]) => {
      if (assessment.userId === userId) {
        this.riskAssessments.delete(id);
      }
    });

    // Create new assessments
    const newAssessments: RiskAssessment[] = [];
    for (const assessment of assessments) {
      const newAssessment = await this.createRiskAssessment(assessment);
      newAssessments.push(newAssessment);
    }
    return newAssessments;
  }

  // Recommendations
  async getRecommendations(userId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(rec => rec.userId === userId);
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.currentRecommendationId++;
    const recommendation: Recommendation = {
      ...insertRecommendation,
      id,
      createdAt: new Date(),
    };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async updateRecommendation(id: number, updates: Partial<InsertRecommendation>): Promise<Recommendation | undefined> {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) return undefined;
    
    const updatedRecommendation = { ...recommendation, ...updates };
    this.recommendations.set(id, updatedRecommendation);
    return updatedRecommendation;
  }

  // Health passports
  async getHealthPassport(userId: number): Promise<HealthPassport | undefined> {
    return Array.from(this.healthPassports.values()).find(passport => passport.userId === userId);
  }

  async createHealthPassport(insertPassport: InsertHealthPassport): Promise<HealthPassport> {
    const id = this.currentHealthPassportId++;
    const passport: HealthPassport = {
      ...insertPassport,
      id,
      lastGenerated: new Date(),
    };
    this.healthPassports.set(id, passport);
    return passport;
  }

  async getHealthPassportByPassportId(passportId: string): Promise<HealthPassport | undefined> {
    return Array.from(this.healthPassports.values()).find(passport => passport.passportId === passportId);
  }

  // Chat messages
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(msg => msg.userId === userId);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
