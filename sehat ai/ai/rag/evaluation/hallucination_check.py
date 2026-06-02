from typing import Dict

class HallucinationCheck:
    def detect(self, text: str) -> bool:
        if not text:
            return True
        return False

    def explain(self, text: str) -> Dict[str, any]:
        return {'isHallucination': self.detect(text), 'confidence': 0.0}
