import React from 'react';
import { Screen } from '../App';
import { onboardingState } from '../state/onboarding';

type RegisterProps = {
  onNavigate: (s: Screen) => void;
  onNotify?: (message: string) => void;
};

export default function Register({ onNavigate, onNotify }: RegisterProps) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState(onboardingState.draft?.email || '');
  const [password, setPassword] = React.useState(onboardingState.draft?.password || '');

  const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const name = `${firstName} ${lastName}`.trim();
    if (!name || !email.trim() || password.length < 6) {
      onNotify?.('Please fill valid account details');
      return;
    }
    onboardingState.draft = {
      name,
      email: email.trim(),
      password,
    };
    onNavigate('profile-builder');
  };

  const comingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    onNotify?.('Coming soon');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-surface-container-low border border-outline-variant/30 maverick-shadow overflow-hidden">
        
        {/* Left Panel - Progress */}
        <div className="w-full md:w-1/3 p-10 border-r border-outline-variant/30 flex flex-col justify-between bg-surface-container-lowest relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-surface-container-highest">
            <div className="h-full bg-primary w-1/3"></div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>code_blocks</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">Maverick</span>
            </div>

            <h2 className="text-sm font-bold tracking-widest text-outline uppercase mb-8">Registration Progress</h2>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-surface-container-highest before:to-surface-container-highest">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary bg-surface-container-lowest text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-odd:pr-4 md:group-even:pl-4">
                  <h3 className="font-bold text-white text-sm">Account Details</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Basic credentials</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-outline-variant bg-surface-container-lowest text-outline-variant shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="material-symbols-outlined text-[12px]">circle</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-odd:pr-4 md:group-even:pl-4">
                  <h3 className="font-bold text-outline text-sm">Profile Builder</h3>
                  <p className="text-outline-variant text-xs mt-1">Resume parsing</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-outline-variant bg-surface-container-lowest text-outline-variant shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="material-symbols-outlined text-[12px]">circle</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-odd:pr-4 md:group-even:pl-4">
                  <h3 className="font-bold text-outline text-sm">Review &amp; Submit</h3>
                  <p className="text-outline-variant text-xs mt-1">Final confirmation</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-outline-variant/30">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              "Maverick's assessment engine is the most rigorous I've encountered. It accurately mapped my skills in minutes."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <img className="w-8 h-8 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwido4FrOyQDl-Ivu-_zuj02_tAWsydu_3xRfz7MhShCvwB731oElIDT_1kELoCc6UBxTOb0gwof3RA2RO4pGvycoTM6hEinNJHXl8kOTjYjZGpud3OfKen9iNvQFe4hmfCAtzAc2GXF7BDOsFSf6t1dIMwJ5nLZlC0RPp1Nv2UhuBbmJXoVVavcrG-kCDyhLlIDWQcb4BQ9_lrNkpbrmvCYUrUIWewMp0dsTJjY22ivLJAmg2aeIoBOh5Pu-xPjgV2fozKCQlkA" alt="Testimonial Avatar" referrerPolicy="no-referrer" />
              <div>
                <p className="text-xs font-bold text-white">Sarah Jenkins</p>
                <p className="text-[10px] text-outline">Senior Backend Engineer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-2/3 p-10 md:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">Create your account</h1>
            <p className="text-on-surface-variant text-sm mb-10">
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="text-primary hover:underline font-bold">Log in</a>
            </p>

            <form className="space-y-6" onSubmit={submit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="firstName" className="text-[10px] font-bold text-outline uppercase tracking-widest">First Name</label>
                  <input type="text" id="firstName" className="w-full bg-surface-container-highest border border-outline-variant/50 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary block p-3 transition-colors" placeholder="Jane" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lastName" className="text-[10px] font-bold text-outline uppercase tracking-widest">Last Name</label>
                  <input type="text" id="lastName" className="w-full bg-surface-container-highest border border-outline-variant/50 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary block p-3 transition-colors" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-[10px] font-bold text-outline uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline-variant text-lg">mail</span>
                  </div>
                  <input type="email" id="email" className="w-full bg-surface-container-highest border border-outline-variant/50 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary block pl-10 p-3 transition-colors" placeholder="jane.doe@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-[10px] font-bold text-outline uppercase tracking-widest">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline-variant text-lg">lock</span>
                  </div>
                  <input type="password" id="password" className="w-full bg-surface-container-highest border border-outline-variant/50 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary block pl-10 p-3 transition-colors" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                    <span className="material-symbols-outlined text-outline-variant text-lg hover:text-on-surface-variant transition-colors">visibility_off</span>
                  </div>
                </div>
                <p className="text-[10px] text-outline-variant mt-1">Must be at least 8 characters long.</p>
              </div>

              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input id="terms" type="checkbox" className="w-4 h-4 bg-surface-container-highest border-outline-variant/50 text-primary focus:ring-primary focus:ring-offset-surface" required />
                </div>
                <label htmlFor="terms" className="ml-2 text-xs text-on-surface-variant leading-tight">
                  I agree to the <a href="#" onClick={comingSoon} className="text-primary hover:underline">Terms of Service</a> and <a href="#" onClick={comingSoon} className="text-primary hover:underline">Privacy Policy</a>.
                </label>
              </div>

              <button type="submit" className="w-full kinetic-monolith-gradient text-on-primary font-black tracking-widest uppercase text-sm py-4 px-4 transition-all hover:brightness-110 active:scale-[0.98] mt-4 flex justify-center items-center gap-2">
                CONTINUE
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 flex items-center justify-between">
              <span className="w-1/5 border-b border-outline-variant/30 lg:w-1/4"></span>
              <span className="text-[10px] text-outline uppercase tracking-widest font-bold">Or register with</span>
              <span className="w-1/5 border-b border-outline-variant/30 lg:w-1/4"></span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button type="button" onClick={() => onNotify?.('Coming soon')} className="flex items-center justify-center gap-2 w-full bg-surface-container-highest border border-outline-variant/30 hover:bg-surface-container-high text-white font-bold text-sm py-3 px-4 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </button>
              <button type="button" onClick={() => onNotify?.('Coming soon')} className="flex items-center justify-center gap-2 w-full bg-surface-container-highest border border-outline-variant/30 hover:bg-surface-container-high text-white font-bold text-sm py-3 px-4 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
