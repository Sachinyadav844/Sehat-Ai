export const SEVERITY_AGENT_PROMPT = `Classify risk from symptom profile.

Output should include:
- severity
- riskScore
- emergencyClassification
- confidence

Use risk factors, severity characteristics, and duration to determine whether the case is LOW, MEDIUM, HIGH or CRITICAL.`;
