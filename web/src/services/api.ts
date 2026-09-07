import type {
  ApiResponse,
  CaseStudy,
  Credential,
  Experience,
  HealthMetrics,
  Profile,
  SimulationResult,
  Skill,
  WebhookLog,
} from '../types';

const BASE_URL = '/api/v1';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || `HTTP error ${res.status}`);
  }

  return json.data as T;
}

export const api = {
  // Public
  getProfile: () => request<Profile>('/profile'),
  getCaseStudies: () => request<CaseStudy[]>('/case-studies'),
  getCaseStudy: (slug: string) => request<CaseStudy>(`/case-studies/${slug}`),
  getSkills: () => request<Skill[]>('/skills'),
  getSkillsByCategory: () => request<Record<string, Skill[]>>('/skills/categories'),
  getExperiences: () => request<Experience[]>('/experiences'),
  getCredentials: () => request<Credential[]>('/credentials'),
  getHealth: () => request<HealthMetrics>('/health'),

  simulateWebhook: (provider: string, eventType: string, payload: string, signature?: string) =>
    request<SimulationResult>('/webhooks/test', {
      method: 'POST',
      body: JSON.stringify({ provider, event_type: eventType, payload, signature }),
    }),

  // Auth
  login: (username: string, password: string) =>
    request<{ token: string; username: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  getMe: () => request<{ username: string }>('/auth/me'),

  // Admin
  updateProfile: (profile: Partial<Profile>) =>
    request<Profile>('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  listAllCaseStudies: () => request<CaseStudy[]>('/admin/case-studies'),
  createCaseStudy: (cs: Partial<CaseStudy>) =>
    request<CaseStudy>('/admin/case-studies', {
      method: 'POST',
      body: JSON.stringify(cs),
    }),
  updateCaseStudy: (id: number, cs: Partial<CaseStudy>) =>
    request<CaseStudy>(`/admin/case-studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cs),
    }),
  deleteCaseStudy: (id: number) =>
    request<{ message: string }>(`/admin/case-studies/${id}`, {
      method: 'DELETE',
    }),

  createSkill: (s: Partial<Skill>) =>
    request<Skill>('/admin/skills', {
      method: 'POST',
      body: JSON.stringify(s),
    }),
  updateSkill: (id: number, s: Partial<Skill>) =>
    request<Skill>(`/admin/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(s),
    }),
  deleteSkill: (id: number) =>
    request<{ message: string }>(`/admin/skills/${id}`, {
      method: 'DELETE',
    }),

  createExperience: (exp: Partial<Experience>) =>
    request<Experience>('/admin/experiences', {
      method: 'POST',
      body: JSON.stringify(exp),
    }),
  updateExperience: (id: number, exp: Partial<Experience>) =>
    request<Experience>(`/admin/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exp),
    }),
  deleteExperience: (id: number) =>
    request<{ message: string }>(`/admin/experiences/${id}`, {
      method: 'DELETE',
    }),

  createCredential: (c: Partial<Credential>) =>
    request<Credential>('/admin/credentials', {
      method: 'POST',
      body: JSON.stringify(c),
    }),
  updateCredential: (id: number, c: Partial<Credential>) =>
    request<Credential>(`/admin/credentials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(c),
    }),
  deleteCredential: (id: number) =>
    request<{ message: string }>(`/admin/credentials/${id}`, {
      method: 'DELETE',
    }),

  getWebhookLogs: (limit = 50) => request<WebhookLog[]>(`/admin/webhooks/logs?limit=${limit}`),
};
