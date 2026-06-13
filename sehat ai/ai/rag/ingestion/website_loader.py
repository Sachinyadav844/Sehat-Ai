import requests
from bs4 import BeautifulSoup
from typing import List

class WebsiteLoader:
    def load(self, url: str) -> List[str]:
        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            html = resp.text
            soup = BeautifulSoup(html, 'html.parser')
            return [p.get_text(separator=' ', strip=True) for p in soup.find_all('p') if p.get_text(strip=True)]
        except Exception:
            return []
