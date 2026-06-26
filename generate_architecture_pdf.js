m  const PDFDocument = require('pdfkit'):
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ size: 'A4', margin: 35 });
const outputPath = path.join(process.cwd(), 'GeneGuard_Architecture.pdf');
const stream = fs.createWriteStream(outputPath);

doc.pipe(stream);

// Title
doc.fontSize(20).font('Helvetica-Bold').text('GeneGuard Tracker', { align: 'center' });
doc.fontSize(14).font('Helvetica-Bold').text('System Architecture', { align: 'center' });
doc.fontSize(11).font('Helvetica').text('Complete AI Model & Website Architecture', { align: 'center' });
doc.fontSize(9).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center', color: '#666' });
doc.moveDown(2);

// Quick Overview
doc.fontSize(12).font('Helvetica-Bold').text('System Overview');
doc.fontSize(9).font('Helvetica').text(
  'GeneGuard Tracker is an AI-powered genetic risk assessment platform combining React frontend, Express.js backend, PostgreSQL database, and Google Gemini AI integration. The system tracks family medical history and provides personalized health recommendations.',
  { align: 'left', width: 525 }
);
doc.moveDown(1.5);

// Architecture Diagram
doc.fontSize(12).font('Helvetica-Bold').text('Architecture Layers');
doc.fontSize(8).font('Helvetica');
const layers = [
  { name: 'Frontend', tech: 'React 18, Vite, TanStack Query, shadcn/ui, Tailwind CSS' },
  { name: 'Backend', tech: 'Express.js, Node.js, TypeScript, Drizzle ORM' },
  { name: 'Database', tech: 'PostgreSQL (Neon), 7 primary tables' },
  { name: 'AI Engine', tech: 'Google Gemini 2.5-Flash API' },
];
layers.forEach(layer => {
  doc.text(`• ${layer.name}: ${layer.tech}`);
});
doc.moveDown(1.5);

// Frontend
doc.fontSize(12).font('Helvetica-Bold').text('Frontend Architecture');
doc.fontSize(9).font('Helvetica');
doc.text('Key Technologies:', { underline: true });
doc.fontSize(8).font('Helvetica').list([
  'React 18 - UI framework',
  'Vite - Build tool & dev server',
  'TanStack React Query - State management & data fetching',
  'Wouter - Client-side routing',
  'shadcn/ui - Accessible component library',
  'Tailwind CSS - Utility-first styling',
  'Recharts - Data visualization',
  'React Hook Form - Form management',
  'i18next - Multilingual support (EN, HI, BN, MR)'
]);
doc.moveDown(0.5);

doc.fontSize(9).font('Helvetica');
doc.text('Pages & Components:', { underline: true });
doc.fontSize(8).font('Helvetica').list([
  'Landing - Welcome & overview',
  'Profile Setup - User onboarding',
  'Family Tree - Visual, list, timeline views',
  'Risk Analysis - AI-powered assessment results',
  'Recommendations - Health suggestions',
  'Health Passport - Shareable health record',
  'Doctor View - Read-only healthcare provider view',
  'Settings - User preferences'
]);
doc.moveDown(1.5);

// Backend
doc.fontSize(12).font('Helvetica-Bold').text('Backend Architecture');
doc.fontSize(9).font('Helvetica');
doc.text('Technology Stack:', { underline: true });
doc.fontSize(8).font('Helvetica').list([
  'Express.js - HTTP server framework',
  'Node.js - JavaScript runtime',
  'TypeScript - Type-safe development',
  'Drizzle ORM - Type-safe database mapping',
  'Zod - Schema validation'
]);
doc.moveDown(0.5);

doc.fontSize(9).font('Helvetica');
doc.text('API Endpoints:', { underline: true });
doc.fontSize(8).font('Helvetica').list([
  'Users: GET, POST, PATCH /api/users',
  'Family: GET, POST, PATCH, DELETE /api/users/:userId/family-members',
  'Risks: POST calculate-risks, GET risk-assessments',
  'Recommendations: GET, POST, PATCH /api/users/:userId/recommendations',
  'Passport: GET, POST /api/health-passport',
  'Chat: POST message, GET history'
]);
doc.moveDown(1.5);

// Database Schema
doc.addPage();
doc.fontSize(12).font('Helvetica-Bold').text('Database Schema');
doc.fontSize(8).font('Helvetica');

const tables = [
  { name: 'users', fields: 'id, name, email, age, gender, medical_conditions, lifestyle (JSON), language' },
  { name: 'family_members', fields: 'id, user_id (FK), relation, age, gender, medical_conditions, is_deceased' },
  { name: 'health_conditions', fields: 'id, name, category, icd10_code, heritability_factor, inheritance_pattern' },
  { name: 'risk_assessments', fields: 'id, user_id (FK), condition, risk_score (0-100), risk_level, factors (JSON)' },
  { name: 'recommendations', fields: 'id, user_id (FK), type, title, priority, category, due_date, completed' },
  { name: 'health_passports', fields: 'id, user_id (FK), passport_id, qr_code, shareable_link' },
  { name: 'chat_messages', fields: 'id, user_id (FK), message, response, timestamp' },
];

tables.forEach(table => {
  doc.text(`${table.name}:`, { underline: true, bold: true });
  doc.fontSize(7).text(table.fields, { indent: 10 });
  doc.moveDown(0.3);
  doc.fontSize(8);
});
doc.moveDown(1);

// AI Architecture
doc.fontSize(12).font('Helvetica-Bold').text('AI/ML Architecture');
doc.fontSize(9).font('Helvetica');
doc.text('AI Model: Google Gemini 2.5-Flash', { underline: true, bold: true });
doc.moveDown(0.3);
doc.fontSize(8).font('Helvetica').text(
  'The system uses Google\'s Gemini API to analyze genetic risks. The AI receives user profile, family history, and lifestyle data, then returns a comprehensive risk analysis with scores, confidence levels, and personalized recommendations.',
  { width: 525 }
);
doc.moveDown(0.5);

doc.fontSize(9).font('Helvetica');
doc.text('Risk Analysis Inputs:', { underline: true });
doc.fontSize(8).font('Helvetica').list([
  'User Profile: Age, gender, medical conditions, lifestyle factors',
  'Family History: Relations, conditions, deceased status, diagnosis ages',
  'Lifestyle Data: Smoking, exercise, diet, stress, sleep quality'
]);
doc.moveDown(0.5);

doc.fontSize(9).font('Helvetica');
doc.text('AI Response Output (JSON):', { underline: true });
doc.fontSize(8).font('Helvetica').list([
  'riskScore (0-100): Numerical risk percentage',
  'riskLevel: "low", "medium", or "high"',
  'confidence (0-100): AI confidence in analysis',
  'factors: {familyHistory%, lifestyle%, environmental%, age%}',
  'reasoning: Evidence-based explanation',
  'recommendations: Specific health suggestions',
  'insights: Key patterns and observations'
]);
doc.moveDown(0.5);

doc.fontSize(9).font('Helvetica');
doc.text('Fallback Mechanism:', { underline: true });
doc.fontSize(8).font('Helvetica').text('If Gemini API unavailable, system uses algorithmic risk calculation based on medical weights, heritability factors, and relationship degrees.');
doc.moveDown(1.5);

// Risk Calculation
doc.fontSize(12).font('Helvetica-Bold').text('Risk Calculation Methodology');
doc.fontSize(8).font('Helvetica');

doc.text('Condition Weights:', { underline: true, bold: true });
const conditions = [
  'Diabetes Type 2: 72% heritability, 40% first-degree risk',
  'Heart Disease: 57% heritability, 35% first-degree risk',
  'Breast Cancer: 31% heritability, 45% first-degree risk',
  'Colon Cancer: 45% heritability, 38% first-degree risk',
  'Alzheimer\'s Disease: 79% heritability, 42% first-degree risk',
  'Hypertension: 68% heritability, 30% first-degree risk',
];
conditions.forEach(c => doc.text(`• ${c}`, { indent: 10 }));
doc.moveDown(0.5);

doc.text('Family Relation Weights:', { underline: true, bold: true });
doc.fontSize(7).font('Helvetica').list([
  'First-degree (parents, siblings, children): 40-45% weight',
  'Second-degree (grandparents, aunts, uncles): 18-22% weight',
  'Third-degree (great-grandparents, great-aunts): 6-9% weight'
], { indent: 10 });
doc.moveDown(0.5);

doc.fontSize(8);
doc.text('Risk Classification:', { underline: true, bold: true });
doc.fontSize(7).list([
  'LOW (0-33): Standard preventive care',
  'MEDIUM (34-66): Increased screening recommended',
  'HIGH (67-100): Intensive monitoring needed'
], { indent: 10 });
doc.moveDown(1);

// Tech Stack Summary
doc.addPage();
doc.fontSize(12).font('Helvetica-Bold').text('Complete Tech Stack');
doc.fontSize(9).font('Helvetica');

doc.text('Frontend:', { bold: true });
doc.fontSize(8).font('Helvetica').list([
  'React 18 - UI Framework | Vite - Build tool',
  'TanStack Query v5 - State & data management',
  'Wouter - Client-side routing',
  'shadcn/ui + Radix - Component library',
  'Tailwind CSS - Utility styling',
  'Recharts - Data visualization | Lucide React - Icons',
  'React Hook Form - Forms | i18next - Translations',
  'TypeScript - Type safety'
]);
doc.moveDown(1);

doc.fontSize(9).font('Helvetica');
doc.text('Backend:', { bold: true });
doc.fontSize(8).font('Helvetica').list([
  'Express.js - HTTP server | Node.js - Runtime',
  'TypeScript - Type safety',
  'Drizzle ORM - Database mapping',
  'Zod - Schema validation',
  'PostgreSQL - Database (Neon-backed)'
]);
doc.moveDown(1);

doc.fontSize(9).font('Helvetica');
doc.text('AI & External Services:', { bold: true });
doc.fontSize(8).font('Helvetica').list([
  'Google Gemini 2.5-Flash - AI Model',
  '@google/genai - SDK'
]);
doc.moveDown(1);

doc.fontSize(9).font('Helvetica');
doc.text('Deployment:', { bold: true });
doc.fontSize(8).font('Helvetica').list([
  'Replit - Hosting platform',
  'Single port (5000) for frontend & backend',
  'PostgreSQL database via Neon'
]);
doc.moveDown(1.5);

// User Journey
doc.fontSize(12).font('Helvetica-Bold').text('User Journey & Data Flow');
doc.fontSize(8).font('Helvetica');

const steps = [
  '1. Landing → User clicks "Get Started"',
  '2. Profile Setup → Enter personal & medical info → Save to users table',
  '3. Family Tree → Add family members with medical conditions → Save to family_members table',
  '4. AI Risk Analysis → Trigger calculation → Gemini AI analyzes data → Save to risk_assessments table',
  '5. Recommendations → AI generates personalized advice → Save to recommendations table',
  '6. Health Passport → Create shareable record with QR code → Save to health_passports table',
  '7. Doctor View → Doctors view via shareable link',
  '8. AI Chat → Ask health questions → Stored in chat_messages table'
];
steps.forEach(step => doc.text(step, { indent: 10 }));
doc.moveDown(1.5);

// Key Features
doc.fontSize(12).font('Helvetica-Bold').text('Key Features');
doc.fontSize(8).font('Helvetica');
doc.list([
  '✓ Family Medical History Tracking with visual tree builder',
  '✓ AI-Powered Genetic Risk Assessment for multiple conditions',
  '✓ Personalized Health Recommendations based on risk profile',
  '✓ Digital Health Passport with QR codes and shareable links',
  '✓ Healthcare Provider View (read-only doctor access)',
  '✓ AI Chatbot for health-related questions',
  '✓ Multi-language Support (English, Hindi, Bengali, Marathi)',
  '✓ Accessibility Features (color-blind mode, ARIA labels)',
  '✓ Responsive Design (mobile-first approach)',
  '✓ Data Visualization (charts, graphs, progress indicators)'
]);
doc.moveDown(1);

// Architecture Components
doc.addPage();
doc.fontSize(12).font('Helvetica-Bold').text('Core Components Architecture');
doc.fontSize(9).font('Helvetica');

doc.text('Frontend Component Hierarchy:', { underline: true });
doc.fontSize(8).font('Helvetica').list([
  'App → Router → (Landing, ProfileSetup, FamilyTree, RiskAnalysis, etc.)',
  'FamilyTree → FamilyTreeVisualization → FamilyMemberCard',
  'RiskAnalysis → AIRiskAnalysis + RiskCharts',
  'Navigation, AIchatbot, ColorBlindToggle (Global components)',
  'Providers: QueryClientProvider, ColorBlindProvider, I18nProvider'
]);
doc.moveDown(1);

doc.text('Backend Structure:', { underline: true });
doc.fontSize(8).font('Helvetica').list([
  'server/index.ts - Express initialization & middleware setup',
  'server/routes.ts - REST API endpoint definitions',
  'server/storage.ts - Data persistence layer (MemStorage → DB)',
  'shared/schema.ts - Database schemas & Zod types',
  'shared/risk-engine.ts - Risk calculation algorithms'
]);
doc.moveDown(1);

// API Flow
doc.text('Request/Response Flow:', { underline: true });
doc.fontSize(7).font('Helvetica').text(
  'Client (React) → HTTP Request → Express Router → Storage Layer → Database/External API → Response → React Query → Component Update → User View',
  { width: 520 }
);
doc.moveDown(1.5);

// Summary
doc.fontSize(12).font('Helvetica-Bold').text('System Strengths');
doc.fontSize(8).font('Helvetica').list([
  'Type-Safe: TypeScript + Zod validation throughout',
  'Scalable: Modular architecture with clear separation of concerns',
  'Maintainable: Organized file structure, consistent patterns',
  'Performant: React Query caching, optimized rendering',
  'Accessible: Color-blind mode, ARIA labels, keyboard navigation',
  'Global: Multi-language support, timezone awareness',
  'AI-Powered: Advanced genetic risk assessment via Gemini',
  'Secure: Input validation, prepared statements via ORM',
  'User-Friendly: Intuitive UI with visual components'
]);
doc.moveDown(2);

doc.fontSize(9).font('Helvetica-Oblique').text(
  'GeneGuard Tracker successfully integrates modern web technologies with advanced medical algorithms to provide comprehensive genetic risk assessment and personalized health guidance.',
  { align: 'center', width: 525 }
);

doc.fontSize(7).text(`\nDocument v1.0 • ${new Date().toLocaleString()}`, { align: 'center', color: '#999' });

doc.end();

stream.on('finish', () => {
  console.log(`✓ PDF created: ${outputPath}`);
  console.log(`✓ File size: ${fs.statSync(outputPath).size} bytes`);
  process.exit(0);
});

stream.on('error', (err) => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
