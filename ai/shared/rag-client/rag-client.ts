import axios from "axios";

export interface RagSearchResult {
  id: string;
  score: number;
  content: string;
  source: string;
  metadata: Record<string, unknown>;
}

export interface RagSearchOptions {
  topK?: number;
  filters?: Record<string, unknown>;
}

export class RagClient {
  private endpoint = process.env.RAG_SERVICE_URL || "";

  async search(query: string, options: RagSearchOptions = {}): Promise<RagSearchResult[]> {
    if (!this.endpoint) {
      return [];
    }

    const response = await axios.post(
      this.endpoint,
      { query, ...options },
      { timeout: 15000 }
    );

    return Array.isArray(response.data?.results) ? response.data.results : [];
  }
}
