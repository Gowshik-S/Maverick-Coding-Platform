import type { RegisterResponse } from '../lib/api';

export type OnboardingDraft = {
  name: string;
  email: string;
  password?: string;
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
