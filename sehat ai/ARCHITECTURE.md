# Architecture Guide

## System Overview

Sehat AI is a multi-layered, production-grade healthcare AI platform that coordinates autonomous AI agents to provide comprehensive medical consultation services. The architecture is designed for scalability, reliability, and transparency.

## Layers

### 1. Presentation Layer (Frontend)

**Framework:** TanStack Start + React 19  
**Responsibilities:**
- User interface and interactions
- Real-time consultation chat interface
- Live agent activity monitoring
- Medical report visualization
- Appointment booking workflow

**Key Components:**
- **ConsultationPage** - Video/text consultation UI with real-time transcript
- **DashboardPage** - Live agent status monitoring with performance metrics
- **ReportPage** - Hospital-grade medical report rendering
- **ConsultPage** - Hospital matching and booking interface

### 2. Routing Layer (TanStack Router)

**Architecture:** File-based routing with route-level code splitting

**Route Structure:**
```
/ (home)
├── /ai-doctor (consultation interface)
├── /consult (hospital/doctor matching)
├── /reports (medical report view)
├── /dashboard (agent monitoring)
├── /about (company information)
├── /contact (support contact)
├── /login (authentication)
└── /signup (user registration)
```

**Features:**
- Per-route SEO meta tags
- Route-level code splitting
- Context-aware routing with query client
- Root error boundary and 404 handling

### 3. State Management (TanStack Query + React Context)

**Query Client:**
- Manages server state
- Handles API caching and invalidation
- Provides real-time updates for agent status
- Automatic background refetching

**Context Providers:**
- **I18nContext** - Multilingual UI state
- **RootContext** - Query client injection

### 4. Agent Orchestration Layer

**Multi-Agent System:**

#### Symptom Agent
- **Role:** Extract medical symptoms from natural language
- **Input:** Patient speech/text transcription
- **Output:** Normalized symptom list with confidence scores
- **Reasoning:** Medical terminology normalization, synonym resolution

#### Severity Agent
- **Role:** Clinical risk assessment and scoring
- **Input:** Symptoms, patient history, vital signs
- **Output:** Severity score (0-100), risk category, escalation indicators
- **Reasoning:** Pattern matching against medical knowledge base

#### Safety Agent
- **Role:** Detect red flags and medical emergencies
- **Input:** Symptoms, vital signs, patient state
- **Output:** Emergency probability, escalation recommendation
- **Reasoning:** Rule-based emergency criteria, pattern detection

#### Hospital Agent
- **Role:** Match patients with appropriate healthcare facilities
- **Input:** Symptoms, severity, location, specialization needs
- **Output:** Ranked hospital recommendations with availability
- **Reasoning:** Geospatial matching, capability assessment

#### Appointment Agent
- **Role:** Autonomous appointment booking
- **Input:** Hospital choice, patient availability, urgency level
- **Output:** Confirmed appointment slot with details
- **Reasoning:** Schedule optimization, conflict resolution

#### Report Agent
- **Role:** Generate hospital-grade medical documentation
- **Input:** Full consultation data, medical analysis
- **Output:** PDF/HTML medical report
- **Reasoning:** Clinical documentation standards (ICD-10, etc.)

#### Orchestrator Agent
- **Role:** Coordinate multi-agent workflow
- **Input:** User request, agent outputs
- **Output:** Coordinated response, workflow state
- **Reasoning:** Dependency management, execution sequencing

### 5. API Layer

**Responsibilities:**
- Request/response validation
- Authentication and authorization
- Rate limiting and throttling
- Error handling and normalization
- WebSocket management for real-time updates

**Key Endpoints:**
- `POST /api/consultations` - Start new consultation
- `GET /api/consultations/:id` - Get consultation state
- `WS /api/consultations/:id/stream` - Real-time agent updates
- `GET /api/hospitals` - Hospital search and matching
- `POST /api/appointments` - Book appointments
- `GET /api/reports/:id` - Generate/retrieve reports

### 6. Database Layer

**Data Models:**
- Consultations (metadata, state, timeline)
- Patients (demographics, medical history)
- Agents (status, performance metrics, logs)
- Appointments (bookings, schedules)
- Reports (generated documents, metadata)
- Activities (audit logs, event tracking)

**Storage:**
- Primary: Relational database for structured data
- Cache: Redis for session state and agent status
- File storage: For generated reports (PDF, HTML)

### 7. Integration Layer

**External Services:**
- Hospital management systems (appointment APIs)
- Medical knowledge bases (diagnosis databases)
- Communications (SMS, email for confirmations)
- Payment processors (consultation fees if applicable)
- Analytics (user behavior, agent performance)

## Data Flow

### Consultation Flow

```
1. User Input
   ↓
2. Symptom Agent
   (extract & normalize symptoms)
   ↓
3. Severity Agent
   (calculate risk score)
   ↓
4. Safety Agent
   (check for emergencies)
   ├─ YES → Emergency escalation
   └─ NO → Continue
   ↓
5. Hospital Agent
   (find matching facilities)
   ↓
6. Appointment Agent
   (book available slot)
   ↓
7. Report Agent
   (generate medical report)
   ↓
8. Dashboard Update
   (live monitoring display)
   ↓
9. User Notification
   (confirmation & next steps)
```

## Technology Integration Points

### Frontend to Backend
- REST API for stateless operations
- WebSocket for real-time agent streaming
- Server-Sent Events for status updates

### Agent Communication
- Message queue for inter-agent communication
- Shared context store for common data
- Event publishing for state changes

### Error Handling
- Circuit breaker pattern for external APIs
- Retry logic with exponential backoff
- Fallback responses for degraded services

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers behind load balancer
- Microservices-ready agent architecture
- Database connection pooling

### Performance
- Agent response caching
- Lazy loading of agent modules
- Request coalescing for duplicate requests
- Pagination for large result sets

### Monitoring
- Agent performance metrics (latency, accuracy)
- User session tracking
- API endpoint monitoring
- Error rate alerting

## Security Architecture

### Authentication
- JWT tokens with refresh mechanism
- Secure session storage
- HTTPS-only communication

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Agent-specific permissions

### Data Protection
- Field-level encryption for sensitive data
- PII data masking in logs
- HIPAA compliance measures
- Audit logging for all data access

## Deployment Architecture

### Production Environment
- Cloudflare Workers for edge computing
- Global CDN for static assets
- Regional database replicas
- Multi-region API endpoints

### CI/CD Pipeline
1. Code push to repository
2. Automated testing
3. Lint and security checks
4. Build optimization
5. Staging deployment
6. Production deployment

### Monitoring & Observability
- Application performance monitoring (APM)
- Real-time error tracking
- Custom metrics for business KPIs
- Log aggregation and analysis

## Future Architecture Considerations

- Microservices migration for agents
- Kubernetes orchestration
- GraphQL for flexible queries
- Event sourcing for audit trails
- Machine learning model versioning
- Multi-tenant support

---

For questions about architecture decisions, refer to the DECISIONS.md file or contact the engineering team.
