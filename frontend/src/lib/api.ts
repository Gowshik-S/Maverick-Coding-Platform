export type RegisterPayload = {
  name: string;
  email: string;
  resume: File;
  extra_skills?: string;
  extra_experience?: string;
  extra_education?: string;
  extra_role?: string;
};

export type RegisterResponse = {
  user_id?: number;
  name?: string;
  email?: string;
  skills?: Record<string, string | number>;
  extraction_method?: string;
  needs_more_info?: boolean;
  missing?: string[];
  questions?: Record<string, unknown>;
  partial_name?: string;
  message?: string;
  error?: string;
  detail?: string;
};

export type LoginResponse = {
  user_id?: number;
  name?: string;
  skills?: Record<string, string | number>;
  message?: string;
  error?: string;
  detail?: string;
};

export type AssessmentQuestion = {
  status?: 'generating' | 'ready';
  message?: string;
  title?: string;
  description?: string;
  examples?: Array<{ input?: string; output?: string; explanation?: string }>;
  constraints?: string[];
  starter_code?: string;
  function_name?: string;
  topic?: string;
  difficulty?: number;
  difficulty_label?: string;
};

export type AssessmentSubmitResponse = {
  score: number;
  feedback: string;
  improvement: string;
  time_complexity: string;
  space_complexity: string;
  test_cases_passed: number;
  test_cases_total: number;
  evaluation_error?: string;
  topic?: string;
  difficulty?: number;
  next_difficulty_suggestion?: number;
  can_attempt_next?: boolean;
  can_skip?: boolean;
  next?: string;
};

export type AssessmentNextStepResponse = {
  next: 'assessment' | 'learning_path';
  message?: string;
  question?: AssessmentQuestion;
  learning_path?: Array<Record<string, unknown>>;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function buildUrl(path: string): string {
  return `${API_BASE}${path}`;
}

async function parseJsonSafe(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function backendMessage(data: any, fallback: string): string {
  const msg = data?.error || data?.detail || data?.message;
  if (typeof msg === 'string' && msg.trim()) return msg;
  return fallback;
}

async function throwIfNotOk(res: Response, fallback: string): Promise<any> {
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(`${backendMessage(data, fallback)} [${res.status}]`);
  }
  return data;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('email', payload.email);
  form.append('resume', payload.resume);

  if (payload.extra_skills) form.append('extra_skills', payload.extra_skills);
  if (payload.extra_experience) form.append('extra_experience', payload.extra_experience);
  if (payload.extra_education) form.append('extra_education', payload.extra_education);
  if (payload.extra_role) form.append('extra_role', payload.extra_role);

  const res = await fetch(buildUrl('/api/register'), { method: 'POST', body: form });
  return await throwIfNotOk(res, 'Registration failed');
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const form = new FormData();
  form.append('email', email);
  form.append('password', password);

  const res = await fetch(buildUrl('/api/login'), { method: 'POST', body: form });
  return await throwIfNotOk(res, 'Login failed');
}

export async function getUser(userId: number): Promise<any> {
  const res = await fetch(buildUrl(`/api/user/${userId}`));
  return await throwIfNotOk(res, 'Failed to load user');
}

export async function getLearningPath(userId: number): Promise<any> {
  const res = await fetch(buildUrl(`/api/learning-path/${userId}`));
  return await throwIfNotOk(res, 'Failed to load learning path');
}

export async function getLearningPathStatus(userId: number): Promise<any> {
  const res = await fetch(buildUrl(`/api/learning-path/${userId}/status`));
  return await throwIfNotOk(res, 'Failed to load learning path status');
}

export async function generateLearningPath(userId: number, force = true): Promise<any> {
  const res = await fetch(buildUrl(`/api/learning-path/${userId}/generate`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ force }),
  });
  return await throwIfNotOk(res, 'Failed to generate learning path');
}

export async function getLeaderboard(): Promise<any[]> {
  const res = await fetch(buildUrl('/api/leaderboard'));
  return await throwIfNotOk(res, 'Failed to load leaderboard');
}

export async function getAssessment(userId: number): Promise<AssessmentQuestion> {
  const res = await fetch(buildUrl(`/api/assessment/${userId}`));
  return await throwIfNotOk(res, 'Failed to load assessment');
}

export async function submitAssessment(
  userId: number,
  code: string,
  timeTaken = 0,
  hintsUsed = 0,
): Promise<AssessmentSubmitResponse> {
  const res = await fetch(buildUrl(`/api/submit/${userId}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, time_taken: timeTaken, hints_used: hintsUsed }),
  });
  return await throwIfNotOk(res, 'Failed to submit assessment');
}

export async function nextAssessmentStep(
  userId: number,
  action: 'attempt' | 'skip',
): Promise<AssessmentNextStepResponse> {
  const res = await fetch(buildUrl(`/api/assessment/${userId}/next`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  return await throwIfNotOk(res, 'Failed to continue assessment flow');
}
