# Severity Agent

Standalone clinical severity agent for SehatAI designed to process structured symptom data and return risk severity, confidence, emergency flags, clinical summaries, and recommendations.

## Features

- Distinct risk levels: `LOW`, `MODERATE`, `HIGH`, `EMERGENCY`
- Emergency symptom detection with dedicated dataset
- Weighted symptom scoring
- Duration and age adjustments
- Confidence estimation from data quality and guideline coverage
- Express API routes
- RAG-ready medical knowledge provider interface
- Safety-ready emergency response output
- Comprehensive unit and API tests

## Endpoints

- `POST /severity/analyze`
- `GET /health`
- `GET /rules`
- `GET /risk-levels`

## Run locally

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Build and run:

```bash
npm run build
npm start
```

Run tests:

```bash
npm test
```
