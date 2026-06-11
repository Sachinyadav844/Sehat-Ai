# Safety Agent Documentation

This project is a standalone Safety Agent architecture designed for clinical gating before patient-facing responses.

## Structure

- `src/` - application source code
- `core/` - orchestration and safety engines
- `validators/` - input validation and recommendation review
- `rules/` - configurable clinical and escalation rules
- `confidence/`, `hallucination/`, `escalation/`, `emergency/` - specialized detection logic
- `datasets/` - clinical rule and safety data assets
- `tests/` - unit and API tests
- `rag/` - RAG-ready interface definitions

## Integration

The service can be copied to `SEHAT-AI/ai/agents/safety-agent/` and runs independently with no orchestrator or frontend dependencies.
