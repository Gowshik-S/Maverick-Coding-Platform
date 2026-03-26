import React from 'react';
import { Screen } from '../App';

export default function Login({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans flex items-center justify-center p-4 selection:bg-[#e6883a]/30">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-[#1b1b1c] rounded-none shadow-2xl overflow-hidden border border-[#353535]">
        
        {/* Left Panel - Branding & Value Prop */}
        <div className="w-full md:w-5/12 p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b1c] via-[#1b1b1c] to-[#353535] opacity-50 z-0"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#e6883a] rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-8 h-8 bg-[#e6883a] rounded-none flex items-center justify-center">
                <span className="material-symbols-outlined text-[#131313] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>code_blocks</span>
              </div>
              <span className="text-xl font-bold tracking-tighter text-[#e5e2e1] uppercase">Maverick</span>
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-[#e5e2e1] mb-6 leading-[1.1]">
              Welcome back.<br/>
              Continue your<br/>
              <span className="text-[#e6883a]">learning journey.</span>
            </h1>
            
            <p className="text-[#dac2b2] text-sm mb-12 leading-relaxed max-w-sm">
              Access your personalized dashboard, track your progression, and dive back into your technical assessments.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#353535] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#e6883a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <h3 className="text-[#e5e2e1] font-bold text-sm mb-1">Adaptive Assessments</h3>
                  <p className="text-[#dac2b2] text-xs">Pick up exactly where you left off.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#353535] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#e6883a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <h3 className="text-[#e5e2e1] font-bold text-sm mb-1">Global Leaderboard</h3>
                  <p className="text-[#dac2b2] text-xs">See how you rank against peers.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#353535] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#e6883a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <h3 className="text-[#e5e2e1] font-bold text-sm mb-1">Curated Learning</h3>
                  <p className="text-[#dac2b2] text-xs">New modules based on your skill gaps.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-16">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-8 h-8 rounded-full border-2 border-[#1b1b1c]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaNQo4HsViJosONnKZpK0Vm1hv5m2UxHfhvREk5I534kkAG3-Vgj8mwLMakeAzHScgxLZ_GKg3HuE3Q1jlWfz0gqoNwSEDCF49WO8j0d4RFUSA01A1NdaR0eGPAFJNRHbTNA8s_AzK7zncBCUuh-kLlKBvmAtw1-rgAuBnS7FwD1lksewiQx05GR__vlyEsAffhqNIWdTDlUE496n74AfXZjt_8g8om5laCOiCo3SEjv4WsXLUPgd2WXBRDJE_8EsPWRLwfuXZog" alt="User Avatar" referrerPolicy="no-referrer" />
                <img className="w-8 h-8 rounded-full border-2 border-[#1b1b1c]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwido4FrOyQDl-Ivu-_zuj02_tAWsydu_3xRfz7MhShCvwB731oElIDT_1kELoCc6UBxTOb0gwof3RA2RO4pGvycoTM6hEinNJHXl8kOTjYjZGpud3OfKen9iNvQFe4hmfCAtzAc2GXF7BDOsFSf6t1dIMwJ5nLZlC0RPp1Nv2UhuBbmJXoVVavcrG-kCDyhLlIDWQcb4BQ9_lrNkpbrmvCYUrUIWewMp0dsTJjY22ivLJAmg2aeIoBOh5Pu-xPjgV2fozKCQlkA" alt="User Avatar" referrerPolicy="no-referrer" />
                <div className="w-8 h-8 rounded-full border-2 border-[#1b1b1c] bg-[#353535] flex items-center justify-center text-[10px] font-bold text-[#e5e2e1]">+2k</div>
              </div>
              <span className="text-[#dac2b2] text-xs font-medium">Join elite engineers.</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-7/12 bg-[#131313] p-12 md:p-20 flex flex-col justify-center border-l border-[#353535]">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-2xl font-black tracking-tight text-[#e5e2e1] mb-2 uppercase">Sign In</h2>
            <p className="text-[#dac2b2] text-sm mb-8">
              Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('register'); }} className="text-[#e6883a] hover:underline font-bold">Create one</a>
            </p>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#544338] text-lg">mail</span>
                  </div>
                  <input type="email" id="email" className="w-full bg-[#1b1b1c] border border-[#353535] text-[#e5e2e1] text-sm rounded-none focus:ring-1 focus:ring-[#e6883a] focus:border-[#e6883a] block pl-10 p-3 transition-colors" placeholder="engineer@maverick.io" required />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs text-[#e6883a] hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#544338] text-lg">lock</span>
                  </div>
                  <input type="password" id="password" className="w-full bg-[#1b1b1c] border border-[#353535] text-[#e5e2e1] text-sm rounded-none focus:ring-1 focus:ring-[#e6883a] focus:border-[#e6883a] block pl-10 p-3 transition-colors" placeholder="••••••••" required />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                    <span className="material-symbols-outlined text-[#544338] text-lg hover:text-[#dac2b2] transition-colors">visibility_off</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input id="remember-me" type="checkbox" className="w-4 h-4 bg-[#1b1b1c] border-[#353535] rounded-none text-[#e6883a] focus:ring-[#e6883a] focus:ring-offset-[#131313]" />
                <label htmlFor="remember-me" className="ml-2 text-sm text-[#dac2b2]">Remember me for 30 days</label>
              </div>

              <button type="submit" className="w-full bg-[#e6883a] hover:bg-[#ffb782] text-[#131313] font-black tracking-wider uppercase text-sm py-4 px-4 rounded-none transition-colors mt-4 flex justify-center items-center gap-2">
                SIGN IN
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 flex items-center justify-between">
              <span className="w-1/5 border-b border-[#353535] lg:w-1/4"></span>
              <span className="text-xs text-[#544338] uppercase tracking-widest font-bold">Or continue with</span>
              <span className="w-1/5 border-b border-[#353535] lg:w-1/4"></span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 w-full bg-[#1b1b1c] border border-[#353535] hover:bg-[#353535] text-[#e5e2e1] font-bold text-sm py-3 px-4 rounded-none transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </button>
              <button className="flex items-center justify-center gap-2 w-full bg-[#1b1b1c] border border-[#353535] hover:bg-[#353535] text-[#e5e2e1] font-bold text-sm py-3 px-4 rounded-none transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>
            
            <p className="mt-8 text-center text-xs text-[#544338]">
              By signing in, you agree to our <a href="#" className="hover:text-[#dac2b2] underline">Terms of Service</a> and <a href="#" className="hover:text-[#dac2b2] underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
