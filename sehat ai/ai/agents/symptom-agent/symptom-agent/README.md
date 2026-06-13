# Symptom Agent

A modular Symptom Intake Agent microservice for SehatAI, built with TypeScript, Fastify, LangChain, Zod, and OpenAI.

## Features

- Real-time patient conversation architecture
- Symptom extraction and follow-up questions
- Emergency detection
- Session memory with Redis-ready adapter
- Multilingual support and auto language detection
- Structured JSON responses with validation
- Production-ready API endpoints

## Run locally

1. Install dependencies:

   npm install

2. Add OpenAI credentials to `.env`.

3. Start development server:

   npm run dev

## Endpoints

- `GET /health`
- `POST /session/start`
- `POST /symptoms/analyze`
- `GET /session/:id`
- `DELETE /session/:id`
