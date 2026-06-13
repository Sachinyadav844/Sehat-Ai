# Sehat AI

**Intelligent AI-powered healthcare platform** providing real-time multi-agent medical consultations, hospital matching, appointment booking, and medical report generation.

## Overview

Sehat AI is a production-grade healthcare AI platform that orchestrates multiple specialized AI agents to provide comprehensive medical consultation services. The system analyzes patient symptoms, assesses severity, detects safety risks, matches nearby hospitals, books appointments, and generates hospital-grade medical reports.

**Key Features:**
- Real-time AI video consultations with voice and text support
- Accurate symptom analysis and medical reasoning
- Dynamic severity scoring with emergency escalation
- Intelligent hospital matching and availability checking
- Autonomous appointment booking
- Hospital-grade medical report generation
- Multilingual support (English, Hindi, Urdu)
- Live agent activity monitoring and transparency dashboard

## Architecture

### Technology Stack

- **Frontend Framework:** TanStack Start with React 19 and TypeScript
- **Build Tool:** Vite 7 with Tailwind CSS v4
- **UI Components:** shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS v4 with semantic color tokens
- **Animations:** Framer Motion
- **Charts & Visualization:** Recharts
- **State Management:** TanStack Query (React Query)
- **Routing:** TanStack Router with file-based routes
- **i18n:** Context-based multilingual support
- **Icons:** Lucide React
- **Deployment:** Cloudflare Workers (Wrangler)

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation header
│   ├── Footer.tsx      # Application footer
│   ├── AgentCard.tsx   # AI agent status card
│   ├── FloatingCard.tsx # Animated floating elements
│   └── ...
├── routes/             # TanStack Router file-based routes
│   ├── __root.tsx      # Root layout and providers
│   ├── index.tsx       # Home page
│   ├── ai-doctor.tsx   # Consultation interface
│   ├── consult.tsx     # Hospital/consultation matching
│   ├── reports.tsx     # Medical report view
│   ├── dashboard.tsx   # Live agent monitoring
│   └── ...
├── lib/                # Utility functions and helpers
│   ├── utils.ts        # Common utilities
│   ├── i18n.tsx        # Internationalization
│   ├── error-capture.ts # Error tracking
│   └── error-page.ts   # Error page renderer
├── hooks/              # Custom React hooks
├── assets/             # Images and static assets
├── styles.css          # Global styles with Tailwind
├── router.tsx          # Router configuration
├── start.ts            # TanStack Start initialization
└── server.ts           # Server entry point (Cloudflare)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun package manager (recommended)
- Cloudflare account for deployment

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sehat-ai
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

### Development

Start the development server with live reload:

```bash
bun run dev
```

The application will be available at `http://localhost:5173`

### Building

Create a production build:

```bash
bun run build
```

Build for development debugging:

```bash
bun run build:dev
```

### Preview

Preview the production build locally:

```bash
bun run preview
```

## Code Quality

### Linting

Run ESLint to check code quality:

```bash
bun run lint
```

### Code Formatting

Format code with Prettier:

```bash
bun run format
```

## Deployment

### Cloudflare Workers

Deploy to Cloudflare Workers:

```bash
bun run deploy
```

The application uses `wrangler.jsonc` for Cloudflare configuration.

## Multi-Agent Architecture

Sehat AI orchestrates multiple specialized AI agents:

1. **Symptom Agent** - Extracts and validates medical symptoms from natural language
2. **Severity Agent** - Calculates clinical severity scores and risk levels
3. **Safety Agent** - Monitors for red flags and determines escalation urgency
4. **Hospital Agent** - Matches patients with nearby qualified hospitals
5. **Appointment Agent** - Autonomously books consultation slots
6. **Report Agent** - Generates hospital-grade medical reports
7. **Orchestrator** - Coordinates multi-agent workflow and reasoning chains

All agents operate with confidence scoring and are monitored in real-time through the dashboard.

## API Integration

The frontend connects to backend services for:

- AI agent orchestration
- Hospital and appointment databases
- Medical report generation
- User authentication and session management
- Real-time WebSocket updates for live monitoring

Refer to the backend documentation for API specifications.

## Internationalization (i18n)

Multilingual support is implemented via React Context with support for:

- **English** (en)
- **Hindi** (hi)
- **Urdu** (ur)

Users can switch languages using the language selector in the navigation bar.

## Styling Guide

### Design System

The application uses a semantic design system with Tailwind CSS v4:

**Primary Colors:**
- Primary: `#12C7B5` (Teal)
- Secondary: `#0FAF9D`
- Light: `#EFFFFC`

**Semantic Colors:**
- Background: `#FFFFFF`
- Section: `#F8FFFD`
- Border: `#DDF5F1`
- Foreground: `#1E293B`
- Muted: `#64748B`

**Status Colors:**
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Danger: `#EF4444` (Red)

**Gradients:**
- Primary gradient: Teal to Mint
- Medical shadow: Soft teal shadow effect

### Component Patterns

- **Buttons:** Rounded-full with gradient variants
- **Cards:** 24px border radius with soft shadows
- **Typography:** Poppins for headings, Inter for body
- **Spacing:** Consistent padding and margins aligned to 4px grid

## Performance Optimization

- Lazy loading for route components
- Image optimization and responsive sizing
- CSS-in-JS compiled at build time
- Efficient state management with React Query
- Code splitting by routes

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive components
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader optimization

## Security

- Input validation on forms
- XSS protection through React
- Secure headers configuration
- Environment variable isolation
- Cloudflare DDoS protection

## Monitoring & Logging

Error handling and monitoring:

- Global error boundary with recovery options
- Console error logging
- Error tracking with custom error pages
- Real-time activity feed for agent monitoring

## Contributing

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Run linting and formatting: `bun run lint` and `bun run format`
4. Submit a pull request with description

## License

Proprietary. All rights reserved.

## Support

For issues, feature requests, or questions:
- Create an issue in the repository
- Contact: support@sehatai.com

---

**Built by Sehat AI Team**  
Bringing intelligent healthcare to everyone
