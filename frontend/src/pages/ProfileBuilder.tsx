import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { registerUser } from '../lib/api';
import { saveSession } from '../lib/session';
import { onboardingState } from '../state/onboarding';

export default function ProfileBuilder() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(onboardingState.resumeFile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const draft = onboardingState.draft;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!draft) {
      setError('Please complete account details first.');
      return;
    }
    if (!file) {
      setError('Please upload a resume file.');
      return;
    }

    try {
      setLoading(true);
      onboardingState.resumeFile = file;
      const response = await registerUser({
        name: draft.name,
        email: draft.email,
        resume: file,
      });

      onboardingState.registerResponse = response;

      if (response?.needs_more_info) {
        navigate('/onboarding/manual');
        return;
      }

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

      setError(response?.error || 'Registration failed.');
    } catch (err: any) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl bg-surface-container-low border border-outline-variant/20 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2">Upload your resume</h1>
        <p className="text-sm text-on-surface-variant mb-6">Step 2 of onboarding.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm">Resume (pdf/docx/txt/jpg/png)</label>
          <input
            id="resume-upload"
            title="Upload resume"
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
            className="w-full px-3 py-3 rounded bg-surface-container-highest"
          />

          {file && (
            <p className="text-sm text-on-surface-variant">
              Selected: <strong>{file.name}</strong>
            </p>
          )}

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <Link className="text-sm underline" to="/register">Back</Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded bg-primary-container text-on-primary-container font-bold disabled:opacity-60"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
