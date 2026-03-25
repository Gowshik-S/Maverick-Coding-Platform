import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

import { loginUser } from '../lib/api';
import { saveSession } from '../lib/session';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const data = await loginUser(email, password);
      if (data?.user_id) {
        saveSession({
          user_id: data.user_id,
          name: data.name || 'User',
          skills: data.skills || {},
          email,
        });
        navigate('/dashboard');
        return;
      }
      setError(data?.error || 'Login failed.');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center h-14 px-6 bg-surface-container-low">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors group">
            <ArrowLeft className="w-5 h-5 group-active:scale-90 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
        <div className="text-xl font-bold text-on-surface tracking-tight">
          Maverick Coding Platform
        </div>
        <div className="w-20"></div> {/* Spacer for symmetry */}
      </nav>

      {/* Left Branding Panel */}
      <section className="hidden lg:flex flex-col justify-center w-1/2 px-16 xl:px-24 bg-surface-container-low relative overflow-hidden pt-14">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-5 blur-[160px]"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-on-surface leading-tight tracking-tighter mb-6">
            Welcome back.<br/>Continue your <span className="text-primary">learning journey...</span>
          </h1>
          
          <div className="space-y-6 mt-12">
            {[
              { title: 'AI Skill Assessment', desc: 'Quantify your coding proficiency with our proprietary neural evaluation engine.' },
              { title: 'Adaptive Questions', desc: 'Challenges that evolve in real-time based on your problem-solving speed.' },
              { title: 'Personalized Path', desc: 'A curriculum curated for your specific career goals in software architecture.' },
              { title: 'Live Leaderboard', desc: 'Compare your latency and efficiency against global developers.' },
              { title: 'Hackathons', desc: 'Join weekend sprints to build and ship production-ready modules.' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-1 flex items-center justify-center w-6 h-6 rounded bg-surface-container-highest text-primary">
                  <CheckCircle2 className="w-4 h-4 fill-current text-surface-container-highest" />
                </div>
                <div>
                  <h3 className="text-on-surface font-semibold text-lg">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-12 left-16 xl:left-24">
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-8 h-1 bg-primary"></div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-on-surface-variant">System Core v2.4</span>
          </div>
        </div>
      </section>

      {/* Right Form Panel */}
      <section className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-surface px-6 py-12 pt-24 lg:pt-14">
        <div className="w-full max-w-md">
          <header className="mb-10">
            <h2 className="text-3xl font-bold text-on-surface tracking-tight">Welcome Back</h2>
            <p className="text-on-surface-variant mt-2">Enter your credentials to access the terminal.</p>
          </header>
          
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-bright border-0 text-on-surface py-3 px-4 rounded focus:ring-1 focus:ring-outline transition-all placeholder-outline-variant outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password</label>
                <a href="#" className="text-xs text-primary hover:underline transition-all">Forgot Password?</a>
              </div>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-bright border-0 text-on-surface py-3 px-4 rounded focus:ring-1 focus:ring-outline transition-all placeholder-outline-variant outline-none"
              />
            </div>

            {error ? <p className="text-sm text-error">{error}</p> : null}
            
            <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary-container font-bold py-4 rounded flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.98] transition-all duration-200 shadow-xl shadow-primary/10 disabled:opacity-60">
              SIGN IN 
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-bright"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-4 text-on-surface-variant tracking-widest">Or Continue With</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button aria-label="Sign in with GitHub" className="flex items-center justify-center bg-surface-container hover:bg-surface-container-high border-0 text-on-surface py-3 rounded transition-all active:scale-[0.98]">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
            </button>
            <button aria-label="Sign in with Google" className="flex items-center justify-center bg-surface-container hover:bg-surface-container-high border-0 text-on-surface py-3 rounded transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path><path d="M1 1h22v22H1z" fill="none"></path></svg>
            </button>
          </div>
          
          <footer className="mt-12 text-center">
            <p className="text-sm text-on-surface-variant">
              Don't have an account? 
              <Link to="/register" className="text-primary font-semibold hover:underline inline-flex items-center gap-1 ml-1">
                Create one 
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
