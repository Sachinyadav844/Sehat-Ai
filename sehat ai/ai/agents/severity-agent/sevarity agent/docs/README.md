# Severity Agent Documentation

## Architecture

- `src/core` contains pipeline orchestration, risk scoring, and confidence estimation.
- `src/scoring` contains symptom, emergency, and disease scoring components.
- `src/rules` contains risk categorization rules.
- `src/validators` enforces request and response contract validation.
- `src/interfaces` defines input/output contract types and RAG-ready provider interfaces.
- `src/api` contains HTTP routes for integration.
- `src/datasets` stores structured clinical datasets for scoring logic.

## Integration

Use `src/index.ts` exports for future orchestrator integration:

- `createApp()` to mount the Express app inside a host service
- `analyzeSeverity(payload)` to compute a severity response directly

## Safety

Emergency conditions always return:

```json
{
  "emergency": true,
  "riskLevel": "EMERGENCY"
}
```

## Testing

Built with Vitest and Supertest to cover core risk flows and API behavior.
