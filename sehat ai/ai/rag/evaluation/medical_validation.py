from typing import Dict

class MedicalValidation:
    def validate_document(self, document: Dict[str, any]) -> Dict[str, any]:
        return {
            'valid': bool(document.get('content')),
            'issues': [] if document.get('content') else ['document_missing_content'],
        }
