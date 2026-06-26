import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  age: text("age").notNull(),
  gender: text("gender").notNull(),
  language: text("language").default("en"),
  medicalConditions: text("medical_conditions").array().default([]),
  lifestyle: jsonb("lifestyle").$type<{
    smokingStatus: string;
    exerciseLevel: string;
    dietType: string;
    dietQuality: string;
    stressLevel?: string;
    sleepQuality?: string;
    alcoholConsumption?: string;
    physicalActivity?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Family members table
export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  relation: text("relation").notNull(),
  age: integer("age"),
  gender: text("gender"),
  medicalConditions: text("medical_conditions").array().default([]),
  lifestyle: jsonb("lifestyle").$type<{
    smokingStatus?: string;
    exerciseLevel?: string;
    dietType?: string;
  }>(),
  diagnosisAges: jsonb("diagnosis_ages").$type<Record<string, number>>().default({}),
  isDeceased: boolean("is_deceased").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced health conditions reference based on medical standards
export const healthConditions = pgTable("health_conditions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  icd10Code: text("icd10_code"), // International Classification of Diseases codes
  heritabilityFactor: integer("heritability_factor").notNull(), // 0-100
  inheritancePattern: text("inheritance_pattern"), // "polygenic", "mendelian", "multifactorial"
  genderPrevalence: jsonb("gender_prevalence").$type<{
    male: number;
    female: number;
  }>(),
  typicalOnsetAge: jsonb("typical_onset_age").$type<{
    early: number;
    typical: number;
    late: number;
  }>(),
  description: text("description"),
  preventionRecommendations: text("prevention_recommendations").array().default([]),
  screeningGuidelines: text("screening_guidelines").array().default([]),
});

// Risk assessments
export const riskAssessments = pgTable("risk_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  condition: text("condition").notNull(),
  riskScore: integer("risk_score").notNull(), // 0-100
  riskLevel: text("risk_level").notNull(), // "low", "medium", "high"
  factors: jsonb("factors").$type<{
    familyHistory: number;
    lifestyle: number;
    environmental: number;
    age: number;
  }>(),
  reasoning: text("reasoning"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Health recommendations
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // "lifestyle", "screening", "consultation"
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(), // "high", "medium", "low"
  category: text("category").notNull(),
  dueDate: text("due_date"),
  completed: boolean("completed").default(false),
  relatedCondition: text("related_condition"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health passports
export const healthPassports = pgTable("health_passports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  passportId: text("passport_id").notNull().unique(),
  qrCode: text("qr_code"),
  shareableLink: text("shareable_link"),
  lastGenerated: timestamp("last_generated").defaultNow(),
});

// Chat messages (for AI assistant)
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({
  id: true,
  createdAt: true,
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  lastUpdated: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const insertHealthPassportSchema = createInsertSchema(healthPassports).omit({
  id: true,
  lastGenerated: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type HealthCondition = typeof healthConditions.$inferSelect;
export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type HealthPassport = typeof healthPassports.$inferSelect;
export type InsertHealthPassport = z.infer<typeof insertHealthPassportSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
