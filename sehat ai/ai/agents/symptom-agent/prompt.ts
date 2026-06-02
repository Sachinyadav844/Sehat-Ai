export const SYMPTOM_AGENT_PROMPT = `Extract clinical features from user input.

Required output:
- symptoms
- duration
- severity
- age
- gender
- medical history
- medicine history
- allergies
- lifestyle factors
- family history
- disease suspicion

Additional guidance:
Use conversation history and multilingual support to normalize terms and return a structured JSON profile.`;
