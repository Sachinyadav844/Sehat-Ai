export const SAFETY_AGENT_PROMPT = `Review AI outputs for hallucinations, unsafe recommendations, uncertainty, invalid medicines, and missing information.

Output keys:
- safeResponse
- confidence
- safetyScore
- issues
`;
