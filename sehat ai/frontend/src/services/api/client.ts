// API Client Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = {
  baseURL: API_BASE_URL,
  
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

// Consultation API
export const consultationAPI = {
  start(language: string = 'en') {
    return apiClient.post('/api/consultation/start', { language });
  },

  end(consultationId: string) {
    return apiClient.post('/api/consultation/end', { consultationId });
  },

  list() {
    return apiClient.get('/api/consultation');
  },

  get(id: string) {
    return apiClient.get(`/api/consultation/${id}`);
  },
};

// Video API
export const videoAPI = {
  initializeSession(consultationId: string, avatarId: string) {
    return apiClient.post('/api/video/session/init', {
      consultationId,
      avatarId,
    });
  },

  startStream(sessionId: string) {
    return apiClient.post('/api/video/session/start', { sessionId });
  },

  endSession(sessionId: string) {
    return apiClient.post('/api/video/session/end', { sessionId });
  },

  getStatus(sessionId: string) {
    return apiClient.get(`/api/video/session/${sessionId}/status`);
  },

  pauseSession(sessionId: string) {
    return apiClient.post('/api/video/session/pause', { sessionId });
  },

  resumeSession(sessionId: string) {
    return apiClient.post('/api/video/session/resume', { sessionId });
  },

  avatarSpeak(sessionId: string, text: string, emotion: string = 'neutral', language: string = 'en') {
    return apiClient.post('/api/video/avatar/speak', {
      sessionId,
      text,
      emotion,
      language,
    });
  },

  listAvatars() {
    return apiClient.get('/api/video/avatars');
  },
};

// Reports API
export const reportsAPI = {
  generate(consultationId: string) {
    return apiClient.post('/api/reports/generate', { consultationId });
  },

  list() {
    return apiClient.get('/api/reports/list');
  },

  get(reportId: string) {
    return apiClient.get(`/api/reports/${reportId}`);
  },

  delete(reportId: string) {
    return apiClient.delete(`/api/reports/${reportId}`);
  },

  download(reportId: string) {
    return apiClient.get(`/api/reports/${reportId}/download`);
  },
};

// Emergency API
export const emergencyAPI = {
  escalate(consultationId: string, type: string, message: string) {
    return apiClient.post('/api/emergency/escalate', {
      consultationId,
      type,
      message,
    });
  },

  getEvents(consultationId: string) {
    return apiClient.get(`/api/emergency/events/${consultationId}`);
  },

  resolve(emergencyId: string) {
    return apiClient.post('/api/emergency/resolve', { emergencyId });
  },

  getDashboard(consultationId: string) {
    return apiClient.get(`/api/emergency/dashboard/${consultationId}`);
  },

  updateStatus(consultationId: string, status: string) {
    return apiClient.post('/api/emergency/dashboard/status', {
      consultationId,
      status,
    });
  },
};

// Health Check
export const healthAPI = {
  check() {
    return apiClient.get('/health');
  },
};
