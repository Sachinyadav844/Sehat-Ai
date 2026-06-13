from typing import Dict, List

class ClinicalValidation:
    def validate(self, context: Dict[str, any]) -> Dict[str, any]:
        issues = []
        for item in context.get('results', []):
            if item.get('score', 0) < 0.3:
                issues.append(f"Low relevance content from {item.get('source')}")
        return {
            'valid': len(issues) == 0,
            'issues': issues,
        }
