# Safety Agent

Standalone production-grade Safety Agent for SehatAI.

## Features

- Validates symptom and severity outputs
- Detects clinical emergencies and unsafe recommendations
- Validates confidence and consistency
- Detects hallucinations and conflicting conclusions
- Triggers escalation workflows
- Exposes clean REST APIs
- Supports future RAG integration via a knowledge provider interface

## API Endpoints

- `GET /health`
- `GET /rules`
- `GET /emergency-rules`
- `POST /safety/evaluate`

## Setup

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

Run tests:

```bash
npm test
```
