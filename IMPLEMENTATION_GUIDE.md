# Sehat AI - Complete Video Consultation Backend Implementation

## Overview

This is the complete implementation of the **Sehat AI Video Consultation Backend** with AI Avatar Integration, WebRTC signaling, multi-agent orchestration, and real-time communication systems.

## Architecture

### System Components

```
SEHAT AI PLATFORM
├── Frontend (React + TanStack Start)
│   └── Routes: /ai-doctor, /consult, /dashboard, /reports
├── Backend (Node.js + Express)
│   ├── REST APIs
│   ├── WebSocket (Socket.IO)
│   ├── WebRTC Signaling
│   └── Media Services (STT/TTS)
├── AI Service (Python + FastAPI)
│   ├── Multi-Agent Orchestration
│   ├── Symptom Analysis
│   ├── Risk Assessment
│   └── Safety Detection
└── Infrastructure
    ├── PostgreSQL Database
    ├── Redis Cache
    └── TruGen Avatar API
```

## Flow Diagram

```
Patient Clicks "Talk to AI Doctor"
    ↓
Frontend: Initialize WebRTC + Socket.IO
    ↓
Backend: Create Consultation Session
    ↓
TruGen: Initialize Avatar Session
    ↓
Patient: Speak/Audio Input
    ↓
Backend: Receive Audio Stream
    ↓
OpenAI Whisper: STT (Speech → Text)
    ↓
Python AI Service: Multi-Agent Analysis
    ├── Symptom Extraction
    ├── Severity Assessment
    ├── Safety Check
    ├── Hospital Finding
    ├── Appointment Planning
    └── Report Generation
    ↓
Backend: Generate AI Response
    ↓
OpenAI TTS: TTS (Text → Speech)
    ↓
TruGen: Avatar Speaking (Lip-Sync)
    ↓
Backend: Broadcast to Frontend
    ↓
Frontend: Dashboard Updates
    ↓
Automatic Report Generation
    ↓
Emergency Escalation (if needed)
```

## Backend Architecture

### Folder Structure

```
backend/src/
├── controllers/          # HTTP Request Handlers
│   ├── consultationController.ts
│   ├── videoController.ts
│   ├── reportController.ts
│   ├── emergencyController.ts
│   ├── authController.ts
│   └── trugenController.ts
├── routes/               # API Routes
│   ├── consultation.ts
│   ├── video.ts
│   ├── reports.ts
│   ├── emergency.ts
│   ├── auth.ts
│   └── health.routes.ts
├── services/             # Business Logic
│   ├── mediaService.ts       (STT/TTS)
│   ├── trugenService.ts      (Avatar)
│   ├── aiOrchestratorService.ts (AI)
│   ├── authService.ts
│   └── translationService.ts
├── realtime/             # WebSocket & WebRTC
│   ├── consultationSocket.ts (Main Socket Handler)
│   └── webrtcSignaling.ts    (WebRTC Signaling)
├── middleware/           # Express Middleware
│   ├── auth.ts
│   ├── language.ts
│   └── errorHandler.ts
├── database/             # Prisma Client
│   └── client.ts
├── types/                # TypeScript Types
│   └── consultation.ts
├── utils/                # Utilities
│   └── dashboardManager.ts
├── config/               # Configuration
│   └── index.ts
├── agents/               # Deprecated - Use Python Service
├── app.ts                # Express App Setup
└── server.ts             # Server Entry Point
```

### Key Services

#### 1. Media Service (`mediaService.ts`)
- **Speech-to-Text (STT)**: OpenAI Whisper integration
- **Text-to-Speech (TTS)**: OpenAI TTS for natural audio
- **Audio Stream Processing**: Buffer management for real-time audio

#### 2. TruGen Service (`trugenService.ts`)
- Avatar session creation and management
- Natural speech generation with lip-sync
- Emotion and language support
- Stream pause/resume/end

#### 3. AI Orchestrator (`aiOrchestratorService.ts`)
- Coordinates multi-agent workflow
- Manages conversation context
- Handles report generation
- Translates text between languages

#### 4. WebSocket Manager (`consultationSocket.ts`)
- **Socket Events**: Consultation lifecycle management
- **Audio Streaming**: Real-time audio chunk processing
- **WebRTC Signaling**: Peer connection negotiation
- **Avatar Control**: Avatar initialization and speech
- **Dashboard Updates**: Real-time status broadcasts

## API Routes

### Consultation Endpoints
```
POST   /api/consultation/start     # Start consultation session
POST   /api/consultation/end       # End consultation session
GET    /api/consultation           # List user consultations
GET    /api/consultation/:id       # Get consultation details
```

### Video Endpoints
```
POST   /api/video/session/init     # Initialize video session
POST   /api/video/session/start    # Start video streaming
POST   /api/video/session/end      # End video session
GET    /api/video/session/:id/status # Get session status
POST   /api/video/session/pause    # Pause session
POST   /api/video/session/resume   # Resume session
POST   /api/video/avatar/speak     # Avatar speech generation
GET    /api/video/avatars          # List available avatars
```

### Reports Endpoints
```
POST   /api/reports/generate       # Generate medical report
GET    /api/reports/list           # List user reports
GET    /api/reports/:reportId      # Get report details
DELETE /api/reports/:reportId      # Delete report
GET    /api/reports/:reportId/download # Download report
```

### Emergency Endpoints
```
POST   /api/emergency/escalate     # Escalate to emergency
GET    /api/emergency/events/:consultationId # Get emergency events
POST   /api/emergency/resolve      # Mark emergency resolved
GET    /api/emergency/dashboard/:consultationId # Dashboard data
POST   /api/emergency/dashboard/status # Update status
```

## WebSocket Events

### Client → Server

```javascript
// Consultation Lifecycle
socket.emit('consultation:start', { consultationId, userId, language });
socket.emit('consultation:stop', { consultationId });

// Audio Streaming
socket.emit('audio:stream', { consultationId, chunk });
socket.emit('audio:flush', { consultationId });

// WebRTC
socket.emit('webrtc:offer', { consultationId, offer });
socket.emit('webrtc:answer', { consultationId, answer, toSocketId });
socket.emit('webrtc:ice-candidate', { consultationId, candidate });
socket.emit('webrtc:connected', { consultationId });

// Avatar
socket.emit('avatar:init', { consultationId, avatarId });
socket.emit('avatar:speak', { consultationId, text, emotion });

// Dashboard
socket.emit('dashboard:join', { userId });
```

### Server → Client

```javascript
// Consultation Events
io.to(consultationId).emit('consultation:started', { session });
io.to(consultationId).emit('consultation:ended', { timestamp });

// AI Processing
io.to(consultationId).emit('ai:processing', { status });
io.to(consultationId).emit('ai:response', { symptoms, riskLevel, recommendations });
io.to(consultationId).emit('ai:error', { message });

// Transcription
io.to(consultationId).emit('consultation:transcript', { speaker, text, language });

// Dashboard
io.to(`dashboard:${userId}`).emit('dashboard:update', { type, data });

// Emergency
io.to(consultationId).emit('emergency:escalation', { message, type });

// WebRTC
io.to(consultationId).emit('webrtc:offer', { offer, fromSocketId });
io.to(consultationId).emit('webrtc:answer', { answer, fromSocketId });
io.to(consultationId).emit('webrtc:ice-candidate', { candidate });
io.to(consultationId).emit('webrtc:connection-status', { status });
```

## Database Models

### Prisma Schema (schema.prisma)

```prisma
model Consultation {
  id              String
  userId          String
  status          String
  language        String
  startedAt       DateTime?
  endedAt         DateTime?
  transcripts     Transcript[]
  symptoms        Symptom[]
  risk            RiskAssessment?
  appointments    Appointment[]
  reports         MedicalReport[]
  emergencyEvents EmergencyEvent[]
}

model Transcript {
  id              String
  consultationId  String
  speaker         String
  text            String
  language        String
  createdAt       DateTime
}

model Symptom {
  id              String
  consultationId  String
  name            String
  duration        String?
  severity        String?
}

model RiskAssessment {
  id              String
  consultationId  String
  riskScore       Float
  level           String
  confidence      Float
  details         String?
}

model EmergencyEvent {
  id              String
  consultationId  String
  type            String
  message         String
  resolved        Boolean
  createdAt       DateTime
}

model MedicalReport {
  id              String
  consultationId  String
  summary         String
  pdfUrl          String?
  createdAt       DateTime
}
```

## AI Service Endpoints

### Python FastAPI Service (Port 8000)

```
POST /agents/symptom      # Extract symptoms from text
POST /agents/severity     # Assess risk/severity level
POST /agents/safety       # Check for emergency conditions
POST /agents/hospital     # Find nearby hospitals
POST /agents/appointment  # Generate appointment advice
POST /agents/report       # Generate medical report
POST /agents/translate    # Translate text

GET  /health              # Health check
GET  /                    # Service info
```

## Installation & Setup

### Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Set up environment variables
cp ../.env.example .env
# Edit .env with your actual values

# Run database migration
npm run prisma:migrate

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### AI Service Setup

```bash
# Navigate to AI service
cd ai

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="your_key_here"

# Run development server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run production server
python -m gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

### Docker Compose Setup (Recommended)

```bash
# From project root
docker-compose up -d

# This starts:
# - PostgreSQL (port 5432)
# - Redis (port 6379)
# - Backend (port 4000)
# - AI Service (port 8000)
```

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sehat_ai
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# TruGen Avatar
TRUGEN_API_KEY=your_trugen_key
TRUGEN_BASE_URL=https://api.trugen.ai/v1
TRUGEN_AVATAR_ID=avatar_id

# Server
PORT=4000
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:8000

# Logging
LOG_LEVEL=info
```

## Testing

### API Testing

```bash
# Start backend
npm run dev

# In another terminal, test endpoints
curl -X POST http://localhost:4000/api/consultation/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"language":"en"}'
```

### WebSocket Testing

```javascript
// In browser console or Node.js
const io = require('socket.io-client');
const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('consultation:start', {
    consultationId: 'test-123',
    userId: 'user-123',
    language: 'en'
  });
});

socket.on('consultation:started', (data) => {
  console.log('Consultation started:', data);
});
```

## Security Features

### Authentication
- JWT token-based authentication
- Refresh token rotation
- Secure password hashing with bcrypt

### Authorization
- Role-based access control (RBAC)
- Consultation ownership verification
- User-scoped data access

### Data Protection
- End-to-end encryption for sensitive data
- Secure WebSocket connections
- Rate limiting (300 requests/minute)
- CORS protection

### Medical Data Safety
- HIPAA-style secure handling
- Audit logging for sensitive operations
- Data retention policies
- Secure session management

## Performance Optimization

### Caching
- Redis caching for frequently accessed data
- Session state management
- Avatar session caching

### Streaming
- Chunked audio streaming
- Progressive report generation
- Lazy loading of consultation history

### Scalability
- Horizontal scaling with load balancing
- WebSocket rooms for efficient broadcasting
- Database indexing on key queries
- CDN for static assets

## Monitoring & Logging

### Logging
- Morgan HTTP logging
- Structured logging for errors
- Python logging for AI service

### Monitoring
- Health check endpoints (`/health`)
- Socket.IO connection monitoring
- Database connection pooling

## Deployment

### Docker Deployment

```bash
# Build images
docker build -t sehat-backend ./backend
docker build -t sehat-ai ./ai

# Push to registry
docker push your-registry/sehat-backend
docker push your-registry/sehat-ai

# Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace sehat

# Deploy services
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/ai-service.yaml
```

## Troubleshooting

### Common Issues

**WebSocket Connection Fails**
- Check CORS configuration in `app.ts`
- Verify Socket.IO CORS settings in `server.ts`
- Ensure frontend URL is in whitelist

**AI Service Errors**
- Verify `OPENAI_API_KEY` is set
- Check Python service is running on port 8000
- Review AI service logs for specific errors

**TruGen Avatar Issues**
- Verify `TRUGEN_API_KEY` and `TRUGEN_BASE_URL`
- Check avatar ID exists in TruGen dashboard
- Ensure language support for requested language

**Database Connection**
- Verify PostgreSQL is running
- Check `DATABASE_URL` environment variable
- Run `npm run prisma:migrate`

## Project Structure Verification

✅ **No Frontend Breakage**
- Frontend routes remain unchanged
- No UI component modifications
- Backward compatible APIs
- Existing Redux stores untouched

✅ **Clean Backend Integration**
- Modular service architecture
- Type-safe TypeScript
- Comprehensive error handling
- Logging and monitoring

✅ **Scalable AI System**
- Multi-agent orchestration
- Extensible agent framework
- Proper error boundaries
- Retry mechanisms

## Next Steps

1. **Deploy Backend**: Use docker-compose for local testing
2. **Configure AI Service**: Set up OpenAI API key
3. **Test WebSocket**: Verify real-time communication
4. **Enable TruGen**: Set up avatar credentials
5. **Run Tests**: Execute test suite
6. **Deploy to Production**: Use Kubernetes or cloud platform

## Support & Documentation

- API Documentation: Swagger UI at `/api/docs`
- WebSocket Events: See console logs in browser dev tools
- AI Service Docs: OpenAPI at `http://localhost:8000/docs`
- Database Schema: See `prisma/schema.prisma`

---

**Built with ❤️ for Sehat AI**

Last Updated: May 24, 2026
Version: 1.0.0
