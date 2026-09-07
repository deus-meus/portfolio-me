export interface Profile {
  id: number;
  full_name: string;
  role_title: string;
  headline: string;
  bio: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  resume_url: string;
  availability_status: string;
  notice_period: string;
  location: string;
  years_experience: number;
  peak_rps: string;
  sla_uptime: string;
  p99_latency: string;
  updated_at: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
  delta: string;
}

export interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  domain_category: string;
  badge_label: string;
  architecture_flow: string[];
  problems_challenges: string[];
  architecture_solution: string[];
  metrics: ImpactMetric[];
  tech_stack: string[];
  github_url: string;
  docs_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  category: 'languages' | 'frameworks' | 'databases' | 'queues' | 'devops' | 'observability' | string;
  name: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface ExperienceAchievement {
  number: string;
  title: string;
  metric: string;
  description: string;
}

export interface Experience {
  id: number;
  role_title: string;
  company_name: string;
  company_tagline: string;
  employment_type: string;
  location: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  core_focus: string;
  achievements: ExperienceAchievement[];
  tech_stack: string[];
  sort_order: number;
  created_at: string;
}

export interface Credential {
  id: number;
  title: string;
  issuer: string;
  credential_id: string;
  verification_url: string;
  issue_date: string;
  sort_order: number;
  created_at: string;
}

export interface WebhookLog {
  id: number;
  provider: string;
  event_type: string;
  payload: string;
  signature: string;
  is_valid: boolean;
  response_time_ms: number;
  created_at: string;
}

export interface SimulationResult {
  is_valid: boolean;
  expected_signature: string;
  provided_signature: string;
  response_time_ms: number;
  provider: string;
  event_type: string;
}

export interface HealthMetrics {
  status: string;
  uptime: string;
  uptime_seconds: number;
  goroutines: number;
  memory_alloc_mb: number;
  memory_sys_mb: number;
  num_gc: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
