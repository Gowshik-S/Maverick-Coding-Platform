import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { registerUser } from '../lib/api';
import { saveSession } from '../lib/session';
import { onboardingState } from '../state/onboarding';

export default function ProfileManual() {
  const navigate = useNavigate();
  const [extraSkills, setExtraSkills] = useState('');
  const [extraExperience, setExtraExperience] = useState('');
  const [extraEducation, setExtraEducation] = useState('');
  const [extraRole, setExtraRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const draft = onboardingState.draft;
  const resumeFile = onboardingState.resumeFile;
  const incomplete = onboardingState.registerResponse;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!draft || !resumeFile) {
      setError('Please complete previous onboarding steps first.');
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        name: draft.name,
        email: draft.email,
        resume: resumeFile,
        extra_skills: extraSkills,
        extra_experience: extraExperience,
        extra_education: extraEducation,
        extra_role: extraRole,
      });

      onboardingState.registerResponse = response;

      if (response?.user_id) {
        saveSession({
          user_id: response.user_id,
          name: response.name || draft.name,
          email: response.email || draft.email,
          skills: response.skills || {},
        });
        navigate('/onboarding/success');
        return;
      }

      setError(response?.error || 'Could not complete profile setup.');
    } catch (err: any) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl bg-surface-container-low border border-outline-variant/20 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2">Complete your profile</h1>
        <p className="text-sm text-on-surface-variant mb-4">
          We need a few additional details from your resume.
        </p>

        {incomplete?.missing?.length ? (
          <p className="text-sm mb-4">
            Missing fields: <strong>{incomplete.missing.join(', ')}</strong>
          </p>
        ) : null}

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            value={extraSkills}
            onChange={(e) => setExtraSkills(e.target.value)}
            placeholder="Skills (comma separated)"
            className="w-full px-4 py-3 rounded bg-surface-container-highest"
          />
          <input
            value={extraExperience}
            onChange={(e) => setExtraExperience(e.target.value)}
            placeholder="Experience (e.g. 2-5 years)"
            className="w-full px-4 py-3 rounded bg-surface-container-highest"
          />
          <input
            value={extraEducation}
            onChange={(e) => setExtraEducation(e.target.value)}
            placeholder="Education"
            className="w-full px-4 py-3 rounded bg-surface-container-highest"
          />
          <input
            value={extraRole}
            onChange={(e) => setExtraRole(e.target.value)}
            placeholder="Current role"
            className="w-full px-4 py-3 rounded bg-surface-container-highest"
          />

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <Link className="text-sm underline" to="/onboarding/resume">Back</Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded bg-primary-container text-on-primary-container font-bold disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Finalize profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
