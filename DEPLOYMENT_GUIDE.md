# CVMaster Pro - Deployment Guide

## Quick Start

This is a complete CV generation website with AI-powered features, Stripe payments, and user authentication.

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- OpenAI API key (for AI features)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file with:
```
DATABASE_URL=postgresql://username:password@host:port/database
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
VITE_STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
SESSION_SECRET=your-random-session-secret
REPL_ID=your-app-id
REPLIT_DOMAINS=yourdomain.com
```

3. **Set up database:**
```bash
npm run db:push
```

4. **Start development server:**
```bash
npm run dev
```

### Features Included

✅ **Complete CV Builder**
- Multi-step form (Personal Info → Experience → Education → Skills)
- AI-powered content enhancement
- PDF and JSON import capabilities
- Real-time preview with watermarks

✅ **Payment System**
- Stripe integration ($9.99 one-time payment)
- Secure checkout flow
- Premium feature unlocking

✅ **User Authentication**
- Replit Auth integration (OpenID Connect)
- User profiles and session management
- Personalized dashboard

✅ **AI Features**
- Job description enhancement
- Personal summary generation
- PDF content extraction and parsing

✅ **Professional UI**
- Modern responsive design
- Dark/light mode support
- Mobile-optimized interface

### File Structure

```
client/                 # Frontend React app
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utility functions

server/                # Backend Express app
├── services/          # Business logic (AI, PDF parsing)
├── routes.ts          # API endpoints
├── storage.ts         # Data access layer
└── replitAuth.ts      # Authentication setup

shared/                # Shared types and schemas
└── schema.ts          # Database schema and types
```

### Deployment Options

1. **Replit Deployment** (Recommended)
   - Already configured for Replit hosting
   - Automatic HTTPS and domain management
   - Built-in database integration

2. **Vercel/Netlify**
   - Frontend: Deploy client/ folder
   - Backend: Deploy as serverless functions

3. **Traditional Hosting**
   - Use PM2 or similar for process management
   - Configure reverse proxy (Nginx)
   - Set up SSL certificates

### Configuration Notes

- The app uses PostgreSQL with Drizzle ORM
- Authentication works with any OpenID Connect provider
- Stripe webhooks may need additional setup for production
- AI features require OpenAI API credits

### Support

This is a complete, production-ready CV generation platform. All major features are implemented and tested.