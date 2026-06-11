# SehatAI Orchestrator Agent

Standalone, production-ready Orchestrator Agent for SehatAI.

## Overview

This service is the central workflow manager for distributed healthcare orchestration. It receives requests, manages workflow state, routes tasks to agents, collects outputs, tracks progress, and emits real-time events.

## Features

- Workflow state machine
- Dynamic agent registry
- Routing with timeout, retry, and error handling
- Session and conversation state management
- Emergency workflow support
- WebSocket events via Socket.IO
- API endpoints for process control and health checks
- Structured logging with Winston
- Input validation, rate limiting, and sanitization
- Unit and integration-ready tests

## Structure

- `src/core` — orchestrator services, workflow engine, execution manager
- `src/agents` — agent registry, router, client, base agent patterns
- `src/workflow` — pipeline and workflow builder/runner
- `src/state` — session and conversation store
- `src/memory` — short, conversation, and patient memory management
- `src/dashboard` — workflow event publishing and websocket support
- `src/emergency` — emergency detection and event generation
- `src/response` — output composition
- `src/interfaces` — type definitions
- `src/constants` — workflow constants and event names
- `src/utils` — logging, validation, security helpers

## Getting Started

Install dependencies:

```bash
npm install
```

Start in development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

Run tests:

```bash
npm test
```

## API Endpoints

- `POST /process`
- `POST /workflow/start`
- `POST /workflow/continue`
- `GET /workflow/:id`
- `GET /health`
- `GET /agents`

## Notes

This project is intentionally backend-only and integration-ready for future SehatAI monorepo migration. It has no frontend, database, or third-party trust generator dependencies.
