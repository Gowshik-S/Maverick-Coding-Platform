import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { onboardingState } from '../state/onboarding';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState(onboardingState.draft?.name ?? '');
  const [email, setEmail] = useState(onboardingState.draft?.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    onboardingState.draft = {
      name: name.trim(),
      email: email.trim(),
      password,
    };
    navigate('/onboarding/resume');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-surface-container-low border border-outline-variant/20 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-sm text-on-surface-variant mb-6">
          Already have an account? <Link className="underline" to="/login">Log in</Link>
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full px-4 py-3 rounded bg-surface-container-highest"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded bg-surface-container-highest"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded bg-surface-container-highest"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-3 rounded bg-surface-container-highest"
          />

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded bg-primary-container text-on-primary-container font-bold"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
