from typing import List, Dict

class MultilingualPipeline:
    SUPPORTED_LANGUAGES = ['en', 'hi', 'ur', 'bn', 'ta', 'te', 'mr', 'gu', 'pa', 'ml']

    def translate_context(self, results: List[Dict[str, any]], language: str) -> List[Dict[str, any]]:
        if language == 'en' or language not in self.SUPPORTED_LANGUAGES:
            return results
        for item in results:
            item['content'] = f"[{language}] {item.get('content', '')}"
        return results

    def detect_language(self, text: str) -> str:
        return 'en'
