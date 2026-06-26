# GeneGuard - Smart Genetic Risk Tracker

## Overview

GeneGuard is a full-stack web application designed to help users build family medical history trees, assess genetic risks using AI logic, and generate comprehensive health reports. The application provides an intuitive interface for tracking family health data and offers personalized recommendations based on genetic risk analysis.

## Recent Changes (January 2025)

✓ Updated landing page with modern, clean design matching user specifications
✓ Removed Watch Demo button and family tree preview from homepage
✓ Added functional navigation header with all app sections
✓ Integrated Google Gemini AI for advanced genetic risk analysis
✓ Enhanced lifestyle factors with detailed metrics (diet quality, stress level, sleep quality, alcohol consumption)
✓ Created AI Analysis component with risk breakdowns and visual indicators
✓ Maintained color-blind accessibility features throughout the application
✓ Removed all logo components from navigation headers per user request
✓ Maintained simple text-only "GeneGuard" branding across all sections
✓ Clean navigation headers without visual logo elements on all pages
✓ Consistent minimal branding approach site-wide

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript, Tailwind CSS for styling, Wouter for routing
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI components with shadcn/ui design system
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Project Structure
The application follows a monorepo structure with clear separation of concerns:
- `client/` - Frontend React application
- `server/` - Express.js backend server
- `shared/` - Shared types and database schema
- Root configuration files for tooling

## Key Components

### Frontend Architecture
- **Component Library**: Uses shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom health-themed color variables
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for risk visualization
- **Internationalization**: Custom i18n implementation supporting English, Hindi, and Bengali

### Backend Architecture
- **API Structure**: RESTful API with Express.js
- **Data Layer**: Drizzle ORM with PostgreSQL
- **Storage Interface**: Abstract storage interface for database operations
- **Route Organization**: Modular route handlers for different entities

### Database Schema
The database includes tables for:
- **Users**: Personal information, medical conditions, lifestyle data
- **Family Members**: Relationship mapping, medical history, diagnosis ages
- **Health Conditions**: Reference data with heritability factors
- **Risk Assessments**: AI-generated risk scores and reasoning
- **Recommendations**: Personalized health recommendations
- **Health Passports**: Shareable health reports with QR codes
- **Chat Messages**: AI chatbot conversation history

## Data Flow

### User Journey
1. **Profile Setup**: Users create profiles with personal and medical information
2. **Family Tree Building**: Users add family members with medical histories
3. **Risk Analysis**: AI engine calculates genetic risk scores based on family history
4. **Recommendations**: System generates personalized health recommendations
5. **Health Passport**: Users can generate and share comprehensive health reports

### Risk Assessment Engine
- Family history analysis with heritability factors
- Lifestyle factor integration
- Age-based risk adjustments
- Multi-condition risk scoring
- Evidence-based reasoning generation

## External Dependencies

### Core Libraries
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm for type-safe database operations
- **UI**: Comprehensive Radix UI component suite
- **Validation**: Zod for runtime type checking
- **Charts**: Recharts for data visualization
- **PDF Generation**: html2canvas and jsPDF for health passport exports
- **QR Codes**: qrcode.react for shareable health passports

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **ESBuild**: Backend bundling for production
- **Drizzle Kit**: Database migration and schema management

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory
- Backend bundles to `dist/index.js` with external dependencies
- Single deployment artifact containing both frontend and backend

### Environment Configuration
- Database URL configuration through environment variables
- Development/production environment detection
- Replit-specific optimizations for development environment

### Database Management
- Drizzle migrations stored in `migrations/` directory
- Schema changes managed through `drizzle-kit push` command
- PostgreSQL as the production database with Neon serverless driver

### Development Features
- Hot module replacement in development
- Error overlay for runtime errors
- Cartographer integration for Replit environment
- Session-based user management with localStorage fallback

The application is designed as a single-page application with server-side API endpoints, optimized for deployment on platforms like Replit while maintaining scalability for production environments.