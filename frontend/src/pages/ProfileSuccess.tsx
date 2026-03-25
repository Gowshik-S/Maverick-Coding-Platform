import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';

import { onboardingState } from '../state/onboarding';

export default function ProfileSuccess() {
  const response = onboardingState.registerResponse;
  const skills = useMemo(() => {
    if (!response?.skills) return [];
    return Object.entries(response.skills);
  }, [response]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface relative overflow-hidden px-6">
      <div className="max-w-2xl w-full relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-10">
          <div className="w-28 h-28 rounded-full flex items-center justify-center bg-primary-container/20">
            <CheckCircle2 className="w-14 h-14 text-primary-container" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-on-background tracking-tight mb-4">Profile Initialized</h1>
        
        <p className="text-lg text-on-surface-variant max-w-lg mb-12 h-14">
          Your account has been linked to the backend and skill extraction is complete.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl mb-10">
          {skills.length ? skills.map(([skill, level]) => (
            <div key={skill} className="bg-surface-container-low border border-outline-variant/20 p-4 rounded-xl flex items-center justify-between">
              <span className="font-semibold">{skill}</span>
              <span className="text-sm text-on-surface-variant">{level}</span>
            </div>
          )) : (
            <div className="bg-surface-container-low border border-outline-variant/20 p-4 rounded-xl text-on-surface-variant col-span-full">
              Skills were not returned in the latest response.
            </div>
          )}
        </div>

        <Link
          to="/dashboard"
          className="px-10 py-4 bg-primary-container text-on-primary-container font-bold rounded-lg flex items-center justify-center gap-3"
        >
          Enter Workspace
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
