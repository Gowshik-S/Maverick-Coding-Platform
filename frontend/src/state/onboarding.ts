export type OnboardingDraft = {
  name: string;
  email: string;
  password?: string;
};

export type RegisterResponse = {
  user_id?: number;
  name?: string;
  email?: string;
  skills?: Record<string, string>;
  extraction_method?: string;
  needs_more_info?: boolean;
  missing?: string[];
  questions?: Record<string, unknown>;
  partial_name?: string;
  message?: string;
  error?: string;
  suggestion?: string;
};

export const onboardingState: {
  draft: OnboardingDraft | null;
  resumeFile: File | null;
  registerResponse: RegisterResponse | null;
} = {
  draft: null,
  resumeFile: null,
  registerResponse: null,
};
