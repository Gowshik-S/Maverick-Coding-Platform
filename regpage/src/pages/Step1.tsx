import { Link } from 'react-router-dom';
import { ArrowRight, Check, FileText, User } from 'lucide-react';

export default function Step1() {
  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden">
      {/* Left Panel: Progress Steps */}
      <aside className="hidden md:flex flex-col w-[400px] bg-surface-container border-r border-transparent p-12 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img
            className="w-full h-full object-cover grayscale"
            alt="abstract dark geometric patterns"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5FPTtu7nXNufJ9e6u646_lNBaAHE0PwJJ5ILkF1llzGu878Imk5l3AQvGj1CqyvH90n7gcki4HEraN67TGIVk0smuDm1EImGrvVlLoW0fyFyOpAK1Yc8s1NVrgLPlY-jGphQePV_7GXamipKX8TqVJ47uEquYzIS-LyoRKqgy-uJwz13hV8p4hVaLPN0VF_X0fdQVCS9JJrTOmkr476LbKbsqT4iio7VxlFx_-wYsWiOD8tY5cvFsZ30U1F3_VmoFTyeTfNBy4A"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Brand Anchor */}
        <div className="relative z-10 mb-24">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-container flex items-center justify-center rounded-sm">
              <svg className="w-5 h-5 text-on-primary-container" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"></path>
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-on-background">Maverick Coding Platform</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-12">
          {/* Step 1 (Active) */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-primary-container flex items-center justify-center bg-primary-container/10">
                <Check className="w-5 h-5 text-primary-container" strokeWidth={3} />
              </div>
              <div className="w-0.5 h-12 bg-surface-container-highest mt-2"></div>
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-on-background font-semibold text-lg">Your Details</span>
              <span className="text-on-surface-variant text-sm">Account authentication and identity.</span>
            </div>
          </div>

          {/* Step 2 (Pending) */}
          <div className="flex gap-6 opacity-40">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center">
                <FileText className="w-5 h-5 text-on-surface-variant" strokeWidth={2} />
              </div>
              <div className="w-0.5 h-12 bg-surface-container-highest mt-2"></div>
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-on-surface-variant font-medium text-lg">Profile Builder (Resume)</span>
              <span className="text-on-surface-variant text-sm">Skills validation and experience.</span>
            </div>
          </div>

          {/* Step 3 (Pending) */}
          <div className="flex gap-6 opacity-40">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center">
                <Check className="w-5 h-5 text-on-surface-variant" strokeWidth={2} />
              </div>
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-on-surface-variant font-medium text-lg">Profile Ready</span>
              <span className="text-on-surface-variant text-sm">Review and finalize your workspace.</span>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-auto relative z-10">
          <p className="text-on-surface-variant text-sm italic font-light leading-relaxed">
            "The singular environment for high-end editorial development. Designed for focus, engineered for scale."
          </p>
        </div>
      </aside>

      {/* Right Panel: Multi-step Form */}
      <main className="flex-1 bg-surface flex flex-col justify-center items-center px-6 lg:px-24">
        <div className="w-full max-w-md">
          {/* Header */}
          <header className="mb-10 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary-container text-xs font-bold tracking-widest uppercase">Step 1 of 3</span>
              <div className="h-px flex-1 bg-surface-container-highest"></div>
            </div>
            <h1 className="text-3xl font-bold text-on-background tracking-tight">Create your account</h1>
            <p className="text-on-surface-variant mt-2">
              Already have an account? <a href="#" className="text-primary-container hover:underline">Log in</a>
            </p>
          </header>

          {/* Social Sign Up */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-3 bg-surface-container-high py-3 rounded-lg hover:bg-surface-bright transition-all active:scale-95 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-sm font-medium text-on-surface">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 bg-surface-container-high py-3 rounded-lg hover:bg-surface-bright transition-all active:scale-95 group">
              <svg className="w-5 h-5 fill-on-surface" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
              <span className="text-sm font-medium text-on-surface">GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-outline-variant opacity-20"></div>
            <span className="flex-shrink mx-4 text-xs text-on-surface-variant uppercase tracking-widest">Or continue with email</span>
            <div className="flex-grow border-t border-outline-variant opacity-20"></div>
          </div>

          {/* Form */}
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="John Doe" 
                className="w-full bg-surface-container-highest border-none text-on-surface placeholder-on-surface-variant/30 px-4 py-3 rounded focus:ring-1 focus:ring-outline transition-all outline-none" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="john@maverick.io" 
                className="w-full bg-surface-container-highest border-none text-on-surface placeholder-on-surface-variant/30 px-4 py-3 rounded focus:ring-1 focus:ring-outline transition-all outline-none" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wide">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="••••••••" 
                  className="w-full bg-surface-container-highest border-none text-on-surface placeholder-on-surface-variant/30 px-4 py-3 rounded focus:ring-1 focus:ring-outline transition-all outline-none" 
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wide">Confirm</label>
                <input 
                  type="password" 
                  id="confirm" 
                  placeholder="••••••••" 
                  className="w-full bg-surface-container-highest border-none text-on-surface placeholder-on-surface-variant/30 px-4 py-3 rounded focus:ring-1 focus:ring-outline transition-all outline-none" 
                />
              </div>
            </div>

            <div className="pt-6">
              <Link 
                to="/step-2"
                className="w-full bg-primary-container text-on-primary-container py-4 font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary-container/10"
              >
                CONTINUE
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              By clicking "Continue", you agree to our <a href="#" className="underline hover:text-on-surface">Terms of Service</a> and <a href="#" className="underline hover:text-on-surface">Privacy Policy</a>.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
