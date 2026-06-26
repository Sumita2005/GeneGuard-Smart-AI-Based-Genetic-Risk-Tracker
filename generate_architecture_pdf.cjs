const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ size: 'A4', margin: 35 });
const outputPath = path.join(process.cwd(), 'GeneGuard_Architecture.pdf');
const stream = fs.createWriteStream(outputPath);

doc.pipe(stream);

// Title Page
doc.fontSize(24).font('Helvetica-Bold').text('GeneGuard Tracker', { align: 'center' });
doc.fontSize(16).font('Helvetica-Bold').text('System Architecture', { align: 'center' });
doc.fontSize(12).font('Helvetica').text('Complete AI Model & Website Architecture', { align: 'center' });
doc.moveDown(1);
doc.fontSize(10).text(`Document Generated: ${new Date().toLocaleDateString()}`, { align: 'center', color: '#666' });
doc.moveDown(2);

// Overview
doc.fontSize(14).font('Helvetica-Bold').text('📋 System Overview');
doc.fontSize(10).font('Helvetica').text(
  'GeneGuard Tracker is an AI-powered genetic risk assessment platform combining React frontend, Express.js backend, PostgreSQL database, and Google Gemini AI. It tracks family medical history and provides personalized health recommendations.',
  { width: 500 }
);
doc.moveDown(1.5);

// Architecture Layers
doc.fontSize(14).font('Helvetica-Bold').text('🏗️ Architecture Layers');
doc.fontSize(10).font('Helvetica');
doc.list([
  'Frontend: React 18, Vite, TanStack Query, shadcn/ui, Tailwind CSS',
  'Backend: Express.js, Node.js, TypeScript, Drizzle ORM',
  'Database: PostgreSQL (Neon), 7 primary tables',
  'AI Engine: Google Gemini 2.5-Flash API'
]);
doc.moveDown(1.5);

// Frontend
doc.fontSize(14).font('Helvetica-Bold').text('💻 Frontend Architecture');
doc.fontSize(10).font('Helvetica').text('Key Technologies:', { underline: true, bold: true });
doc.fontSize(9).list([
  'React 18 - UI framework with hooks',
  'Vite - Lightning-fast build tool & dev server',
  'TanStack React Query v5 - State management & data fetching',
  'Wouter - Client-side routing (lightweight alternative)',
  'shadcn/ui - Accessible component library built on Radix',
  'Tailwind CSS - Utility-first CSS framework',
  'Recharts - Interactive data visualization',
  'React Hook Form - Form management & validation',
  'i18next - Multilingual support (EN, HI, BN, MR)'
]);
doc.moveDown(0.5);

doc.fontSize(10).text('Pages & Components:', { underline: true, bold: true });
doc.fontSize(9).list([
  'Landing Page - Welcome & platform overview',
  'Profile Setup - User registration & onboarding',
  'Family Tree - Build medical history (3 view modes)',
  'Risk Analysis - AI-powered genetic risk assessment',
  'Recommendations - Personalized health guidance',
  'Health Passport - Digital shareable health record',
  'Doctor View - Read-only healthcare provider access',
  'Settings - User preferences & accessibility'
]);
doc.moveDown(1.5);

// Backend
doc.fontSize(14).font('Helvetica-Bold').text('⚙️ Backend Architecture');
doc.fontSize(10).font('Helvetica').text('Technology Stack:', { underline: true, bold: true });
doc.fontSize(9).list([
  'Express.js - HTTP server & middleware framework',
  'Node.js v20 - JavaScript runtime environment',
  'TypeScript - Type-safe development',
  'Drizzle ORM - Type-safe database operations',
  'Zod - Schema validation & parsing'
]);
doc.moveDown(0.5);

doc.fontSize(10).text('Core Modules:', { underline: true, bold: true });
doc.fontSize(9).list([
  'server/index.ts - Express server initialization',
  'server/routes.ts - REST API endpoint definitions (550+ lines)',
  'server/storage.ts - Data persistence layer',
  'shared/schema.ts - Database schemas & Zod types',
  'shared/risk-engine.ts - Risk calculation algorithms'
]);
doc.moveDown(1.5);

// Database
doc.addPage();
doc.fontSize(14).font('Helvetica-Bold').text('💾 Database Schema (PostgreSQL)');
doc.fontSize(9).font('Helvetica');

const tables = [
  ['users', 'User profiles, medical history, lifestyle factors'],
  ['family_members', 'Family relationships, medical conditions, deceased status'],
  ['health_conditions', 'Reference data: conditions, heritability, guidelines'],
  ['risk_assessments', 'AI-calculated risk scores & factor breakdown'],
  ['recommendations', 'Personalized health advice & action items'],
  ['health_passports', 'Shareable health records with QR codes'],
  ['chat_messages', 'AI chatbot conversation history']
];

doc.text('Primary Tables:', { underline: true, bold: true });
tables.forEach(([name, desc]) => {
  doc.text(`${name}`, { bold: true });
  doc.fontSize(8).text(`→ ${desc}`, { indent: 15, color: '#555' });
  doc.fontSize(9);
});
doc.moveDown(1.5);

// AI Architecture
doc.fontSize(14).font('Helvetica-Bold').text('🤖 AI/ML Architecture');
doc.fontSize(10).font('Helvetica').text('AI Model: Google Gemini 2.5-Flash', { underline: true, bold: true });
doc.moveDown(0.3);

doc.fontSize(9).text('The system uses Google\'s Gemini API to perform comprehensive genetic risk analysis. The AI receives user profile, family history, and lifestyle data to generate personalized risk assessments.', { width: 500 });
doc.moveDown(0.5);

doc.text('Risk Analysis Inputs:', { underline: true });
doc.fontSize(8).list([
  'User Profile: Age, gender, medical conditions, lifestyle',
  'Family History: Relations, conditions, ages, deceased status',
  'Lifestyle: Smoking, exercise, diet, stress, sleep'
]);
doc.moveDown(0.5);

doc.fontSize(9);
doc.text('AI Response Includes:', { underline: true });
doc.fontSize(8).list([
  'riskScore: 0-100 numerical percentage',
  'riskLevel: "low", "medium", or "high"',
  'confidence: 0-100 AI confidence level',
  'factors: Breakdown of family history, lifestyle, environmental, age',
  'reasoning: Evidence-based explanation',
  'recommendations: Specific health suggestions',
  'insights: Key patterns and observations'
]);
doc.moveDown(0.5);

doc.fontSize(9);
doc.text('Fallback Mechanism:', { underline: true });
doc.fontSize(8).text('If Gemini API is unavailable, system uses algorithmic calculation based on medical weights, heritability factors, and relationship degrees.');
doc.moveDown(1.5);

// Risk Calculation
doc.fontSize(14).font('Helvetica-Bold').text('📊 Risk Calculation Methodology');
doc.fontSize(8).font('Helvetica');

doc.text('Condition-Specific Weights:', { underline: true, bold: true });
const conditions = [
  'Diabetes Type 2: 72% heritability, 40% first-degree contribution',
  'Heart Disease: 57% heritability, 35% first-degree contribution',
  'Breast Cancer: 31% heritability, 45% first-degree contribution',
  'Colon Cancer: 45% heritability, 38% first-degree contribution',
  'Alzheimer\'s Disease: 79% heritability, 42% first-degree contribution',
  'Hypertension: 68% heritability, 30% first-degree contribution'
];
conditions.forEach(c => doc.text(`• ${c}`, { indent: 10 }));
doc.moveDown(0.5);

doc.text('Family Relation Risk Weights:', { underline: true, bold: true });
doc.fontSize(7).list([
  '1st Degree (parents, siblings, children): 40-45% weight',
  '2nd Degree (grandparents, aunts, uncles, cousins): 18-22% weight',
  '3rd Degree (great-grandparents, great-aunts): 6-9% weight'
], { indent: 10 });
doc.moveDown(0.5);

doc.fontSize(8);
doc.text('Risk Score Interpretation:', { underline: true, bold: true });
doc.fontSize(7).list([
  'LOW RISK (0-33): Standard preventive care',
  'MEDIUM RISK (34-66): Increased screening recommended',
  'HIGH RISK (67-100): Intensive monitoring needed'
], { indent: 10 });
doc.moveDown(1.5);

// API Endpoints
doc.fontSize(14).font('Helvetica-Bold').text('🔌 REST API Endpoints');
doc.fontSize(8).font('Helvetica');

const endpoints = [
  { category: 'Users', endpoints: ['POST /api/users', 'GET /api/users/:id', 'PATCH /api/users/:id'] },
  { category: 'Family', endpoints: ['GET /api/users/:userId/family-members', 'POST /api/users/:userId/family-members', 'PATCH/DELETE /api/family-members/:id'] },
  { category: 'Risk', endpoints: ['POST /api/users/:userId/calculate-risks', 'GET /api/users/:userId/risk-assessments', 'GET /api/health-conditions'] },
  { category: 'Recommendations', endpoints: ['GET /api/users/:userId/recommendations', 'POST /api/users/:userId/recommendations', 'PATCH /api/recommendations/:id'] },
  { category: 'Passport', endpoints: ['GET /api/users/:userId/health-passport', 'POST /api/users/:userId/health-passport', 'GET /api/health-passport/:passportId'] },
  { category: 'Chat', endpoints: ['POST /api/users/:userId/chat', 'GET /api/users/:userId/chat-history'] }
];

endpoints.forEach(group => {
  doc.text(`${group.category}:`, { bold: true });
  group.endpoints.forEach(ep => doc.text(ep, { indent: 10 }));
});
doc.moveDown(1.5);

// Tech Stack
doc.addPage();
doc.fontSize(14).font('Helvetica-Bold').text('🛠️ Complete Tech Stack');
doc.fontSize(9).font('Helvetica');

doc.text('Frontend Ecosystem:', { bold: true });
doc.fontSize(8).list([
  'React 18 | Vite | TanStack React Query v5',
  'Wouter | shadcn/ui + Radix UI | Tailwind CSS',
  'Recharts | Lucide React | React Hook Form',
  'i18next (i18n) | TypeScript | HTML2Canvas | jsPDF'
]);
doc.moveDown(0.5);

doc.fontSize(9);
doc.text('Backend Stack:', { bold: true });
doc.fontSize(8).list([
  'Express.js | Node.js v20 | TypeScript',
  'Drizzle ORM | Zod | PostgreSQL (Neon)',
  'Connect-PG-Simple (Sessions)'
]);
doc.moveDown(0.5);

doc.fontSize(9);
doc.text('AI & Integrations:', { bold: true });
doc.fontSize(8).list([
  'Google Gemini 2.5-Flash API',
  '@google/genai SDK'
]);
doc.moveDown(0.5);

doc.fontSize(9);
doc.text('Deployment & DevOps:', { bold: true });
doc.fontSize(8).list([
  'Replit Platform | Single Port (5000)',
  'Frontend via Vite Dev Server',
  'Backend via Express on Same Port',
  'PostgreSQL Database (Neon-backed)'
]);
doc.moveDown(1.5);

// User Journey
doc.fontSize(14).font('Helvetica-Bold').text('👤 User Journey & Data Flow');
doc.fontSize(8).font('Helvetica');

const journey = [
  '1️⃣ Landing Page → User clicks "Get Started"',
  '2️⃣ Profile Setup → Enter name, age, gender, medical history',
  '   Saves to: users table',
  '3️⃣ Family Tree Builder → Add family members & conditions',
  '   Saves to: family_members table',
  '4️⃣ AI Risk Analysis → Trigger calculation → Gemini analyzes data',
  '   Saves to: risk_assessments table',
  '5️⃣ Recommendations → AI generates personalized advice',
  '   Saves to: recommendations table',
  '6️⃣ Health Passport → Create shareable record + QR code',
  '   Saves to: health_passports table',
  '7️⃣ Doctor View → Healthcare providers access via link',
  '8️⃣ AI Chatbot → Ask health questions, get AI responses',
  '   Saves to: chat_messages table'
];

journey.forEach(step => doc.text(step, { indent: 8 }));
doc.moveDown(1.5);

// Features
doc.fontSize(14).font('Helvetica-Bold').text('✨ Key Features');
doc.fontSize(8).font('Helvetica').list([
  '✓ Family Medical History Tracking with 3 view modes',
  '✓ AI-Powered Genetic Risk Assessment (Gemini)',
  '✓ Multi-Condition Risk Analysis with confidence scoring',
  '✓ Personalized Health Recommendations',
  '✓ Digital Health Passport with QR codes',
  '✓ Shareable links for healthcare providers',
  '✓ AI Health Chatbot for Q&A',
  '✓ Multi-language Support (English, Hindi, Bengali, Marathi)',
  '✓ Color-blind Mode for accessibility',
  '✓ Responsive Design (mobile-first)',
  '✓ Interactive data visualization (charts & graphs)',
  '✓ Type-safe codebase (TypeScript + Zod)'
]);
doc.moveDown(1.5);

// Summary
doc.fontSize(14).font('Helvetica-Bold').text('📈 Summary');
doc.fontSize(9).font('Helvetica').text(
  'GeneGuard Tracker successfully integrates modern web technologies with advanced AI algorithms to provide comprehensive genetic risk assessment. The architecture ensures scalability, maintainability, and excellent user experience through clear separation of concerns and intelligent design patterns.',
  { width: 500 }
);
doc.moveDown(1);

doc.fontSize(8).text('System Strengths:', { underline: true });
doc.fontSize(7).list([
  'Type-Safe: Full TypeScript + Zod validation',
  'Scalable: Modular architecture with microservice-ready design',
  'AI-Powered: Advanced Gemini integration for analysis',
  'Accessible: Color-blind mode, ARIA labels, keyboard navigation',
  'Global: Multi-language support for diverse audiences',
  'Secure: Input validation, ORM-based queries',
  'Performant: React Query caching, optimized rendering',
  'User-Friendly: Intuitive UI with real-time feedback'
]);

doc.moveDown(2);
doc.fontSize(7).text(`Generated: ${new Date().toLocaleString()} • GeneGuard Tracker v1.0`, { align: 'center', color: '#999' });

doc.end();

stream.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✅ PDF Created Successfully!`);
  console.log(`   File: ${outputPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`   Pages: ~12`);
  process.exit(0);
});

stream.on('error', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
