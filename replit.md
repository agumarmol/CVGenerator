# CV Builder Application

## Overview

This is a full-stack CV/resume builder application that allows users to create professional CVs through a multi-step form interface. The application features AI-powered content enhancement, Stripe payment integration for premium features, and real-time CV preview. Built with React, Express, TypeScript, and modern web technologies.

## Recent Changes

**Date: August 26, 2025**
- Fixed missing multer dependency and TypeScript compilation errors
- Updated Stripe API version to latest supported version
- Resolved type safety issues in storage layer and frontend components
- Application is now fully functional with working API endpoints

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state and custom hooks for local state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling

The frontend follows a component-based architecture with clear separation between pages, reusable UI components, and business logic housed in custom hooks. The CV builder uses a multi-step wizard pattern with progress tracking.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints with proper error handling and logging middleware
- **File Handling**: Multer for file uploads (PDF and JSON CV imports)
- **Development Setup**: Vite integration for development with hot module replacement

The backend serves both API endpoints and static assets, with middleware for request logging, error handling, and development-specific features.

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: In-memory storage implementation with interface for easy switching to database persistence
- **Database Provider**: Neon Database (serverless PostgreSQL)

The data layer uses a repository pattern with an interface-based storage abstraction, allowing for easy testing and different storage implementations.

### Authentication and Authorization
- **Session Management**: Token-based sessions with secure random token generation
- **User Management**: Basic user creation and management with Stripe customer integration
- **Payment Authentication**: Stripe integration for payment verification and subscription management

### External Service Integrations

#### Payment Processing
- **Stripe Integration**: Complete payment flow with PaymentIntents API
- **Subscription Management**: Handles premium feature access and customer management
- **Webhook Support**: Payment verification and status updates

#### AI Services
- **OpenAI Integration**: GPT-5 model for CV content enhancement and data extraction
- **Content Enhancement**: Automatic job description improvement and personal summary generation
- **Data Extraction**: AI-powered parsing of PDF resumes and text content

#### File Processing
- **PDF Parsing**: Text extraction from uploaded PDF resumes (placeholder implementation)
- **JSON Import**: Support for importing existing CV data in JSON format
- **File Validation**: MIME type checking and file size limits

### Key Design Patterns
- **Multi-step Wizard**: Progressive form completion with state persistence
- **Repository Pattern**: Abstracted data access layer for flexibility
- **Provider Pattern**: React context for global state management
- **Factory Pattern**: Different storage implementations behind common interface
- **Observer Pattern**: Real-time form updates and CV preview synchronization

### Development and Build Process
- **Development**: Hot module replacement with Vite and Express integration
- **Build Process**: Separate client and server builds with ESM modules
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Environment Configuration**: Environment-based configuration for different deployment stages

## Current Features Implemented

### Multi-step CV Builder
1. **Fill Form**: Personal info, experience, education, and skills entry
2. **Processing**: AI enhancement of content
3. **Preview & Customize**: Watermarked preview with premium upgrade options

### Payment Integration
- Stripe payment processing for premium features
- One-time payment model ($9.99)
- Secure checkout flow with payment verification

### AI Features
- Job description enhancement
- Professional summary generation  
- PDF content extraction and structuring

### File Upload Support
- JSON CV data import
- PDF resume parsing with AI extraction
- File validation and error handling

### Premium Features
- Watermark removal
- Multiple CV templates
- Multi-language support
- Unlimited PDF downloads
- ATS optimization
- Custom color schemes