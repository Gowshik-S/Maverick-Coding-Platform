export type RegisterPayload = {
  name: string;
  email: string;
  resume: File;
  extra_skills?: string;
  extra_experience?: string;
  extra_education?: string;
  extra_role?: string;
};

export type LoginResponse = {
  user_id?: number;
  name?: string;
  skills?: Record<string, string>;
  message?: string;
  error?: string;
  detail?: string;
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

function extractBackendError(data: any, fallback: string): string {
  const message = data?.error || data?.detail || data?.message;
  if (typeof message === 'string' && message.trim()) {
    return message;
  }
  return fallback;
}

export async function registerUser(payload: RegisterPayload) {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('email', payload.email);
  form.append('resume', payload.resume);

  if (payload.extra_skills) form.append('extra_skills', payload.extra_skills);
  if (payload.extra_experience) form.append('extra_experience', payload.extra_experience);
  if (payload.extra_education) form.append('extra_education', payload.extra_education);
  if (payload.extra_role) form.append('extra_role', payload.extra_role);

  const res = await fetch(buildUrl('/api/register'), {
    method: 'POST',
    body: form,
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const message = extractBackendError(data, `Register failed (${res.status})`);
    throw new Error(`${message} [${res.status}]`);
  }
  return data;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const form = new FormData();
  form.append('email', email);
  form.append('password', password);

  const res = await fetch(buildUrl('/api/login'), {
    method: 'POST',
    body: form,
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const message = extractBackendError(data, `Login failed (${res.status})`);
    throw new Error(`${message} [${res.status}]`);
  }
  return data;
}

export async function getUser(userId: number) {
  const res = await fetch(buildUrl(`/api/user/${userId}`));
  return parseJsonSafe(res);
}

export async function getLearningPath(userId: number) {
  const res = await fetch(buildUrl(`/api/learning-path/${userId}`));
  return parseJsonSafe(res);
}

export async function getLeaderboard() {
  const res = await fetch(buildUrl('/api/leaderboard'));
  return parseJsonSafe(res);
}
