import axios from 'axios';
import { config } from '../config/index.js';

export class AIService {
  private baseUrl: string;

  constructor(baseUrl: string = config.aiServiceUrl) {
    this.baseUrl = baseUrl;
  }

  async ragSearch(query: string, language = 'en', emergency = false) {
    const response = await axios.post(`${this.baseUrl}/rag/search`, { query, language, emergency });
    return response.data;
  }

  async ragContext(query: string, language = 'en') {
    const response = await axios.post(`${this.baseUrl}/rag/context`, { query, language });
    return response.data;
  }

  async ragEmergency(query: string, language = 'en') {
    const response = await axios.post(`${this.baseUrl}/rag/emergency`, { query, language });
    return response.data;
  }

  async ragMultilingual(query: string, language = 'en') {
    const response = await axios.post(`${this.baseUrl}/rag/multilingual`, { query, language });
    return response.data;
  }

  async medicalRetrieve(query: string, language = 'en') {
    const response = await axios.post(`${this.baseUrl}/medical/retrieve`, { query, language });
    return response.data;
  }

  async medicalValidate(query: string, language = 'en', expected: any[] = []) {
    const response = await axios.post(`${this.baseUrl}/medical/validate`, { query, language, expected });
    return response.data;
  }
}
