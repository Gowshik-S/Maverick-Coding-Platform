import React from 'react';
import { Screen } from '../App';

type LandingProps = {
  onNavigate: (s: Screen) => void;
  onNotify?: (message: string) => void;
};

export default function Landing({ onNavigate, onNotify }: LandingProps) {
  const comingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    onNotify?.('Coming soon');
  };

  return (
    <div className="selection:bg-primary/30 min-h-screen bg-[#0e0e11] text-[#fbf8fc] font-sans">
      <nav className="fixed top-0 w-full z-50 bg-[#0e0e11]/80 backdrop-blur-xl shadow-2xl shadow-black/50">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-full">
          <div className="flex items-center gap-12">
            <span className="text-xl font-bold tracking-tighter text-white uppercase">Maverick Coding Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-white transition-all">notifications</span>
            </div>
            <button onClick={() => onNavigate('login')} className="text-zinc-400 hover:text-white transition-colors font-medium text-sm">LOG IN</button>
            <button onClick={() => onNavigate('register')} className="kinetic-monolith-gradient px-6 py-2 text-on-primary font-bold text-sm tracking-tight hover:brightness-110 active:scale-95 duration-200">SIGN UP</button>
          </div>
        </div>
      </nav>
      <main className="relative pt-16">
        <section className="relative min-h-[921px] flex flex-col items-center justify-center px-8 overflow-hidden">
          <div className="absolute top-20 right-[-5%] opacity-20 rotate-12 select-none pointer-events-none hidden lg:block">
            <div className="bg-surface-container-lowest p-8 rounded shadow-2xl border border-outline-variant/15 font-mono text-sm leading-relaxed">
              <div className="flex gap-2 mb-4"><div className="w-3 h-3 rounded-full bg-error-dim"></div><div className="w-3 h-3 rounded-full bg-primary"></div><div className="w-3 h-3 rounded-full bg-tertiary"></div></div>
              <p><span className="code-glow-orange">class</span> <span className="code-glow-teal">MaverickAI</span> {'{'}</p>
              <p className="pl-4"><span className="code-glow-orange">async</span> <span className="code-glow-teal">analyze</span>(engineer) {'{'}</p>
              <p className="pl-8"><span className="code-glow-orange">const</span> metrics = <span className="code-glow-orange">await</span> engineer.<span className="code-glow-teal">getCommitHistory</span>();</p>
              <p className="pl-8"><span className="code-glow-orange">return</span> <span className="code-glow-teal">personalizedPath</span>(metrics);</p>
              <p className="pl-4">{'}'}</p>
              <p>{'}'}</p>
            </div>
          </div>
          <div className="absolute bottom-10 left-[-5%] opacity-20 -rotate-6 select-none pointer-events-none hidden lg:block">
            <div className="bg-surface-container-lowest p-8 rounded shadow-2xl border border-outline-variant/15 font-mono text-sm leading-relaxed">
              <p><span className="code-glow-orange">export const</span> config = {'{'}</p>
              <p className="pl-4">engine: <span className="code-glow-yellow">'GPT-4o'</span>,</p>
              <p className="pl-4">mode: <span className="code-glow-yellow">'technical-editorial'</span>,</p>
              <p className="pl-4">precision: <span className="code-glow-teal">0.99</span></p>
              <p>{'};'}</p>
            </div>
          </div>
          <div className="max-w-5xl w-full text-center relative z-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9]">
              AI-POWERED <span className="text-primary">SKILL</span> ASSESSMENT &amp; <br className="hidden md:block"/> PERSONALIZED LEARNING
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-2xl mx-auto mb-12">
              Built for the modern software engineer. Elevate your technical authority through data-driven insights and curated content.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button onClick={() => onNavigate('register')} className="kinetic-monolith-gradient px-10 py-5 text-on-primary font-black text-lg tracking-tight maverick-shadow hover:brightness-110 active:scale-95 transition-all group">
                Get Started Free <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
              </button>
              <button onClick={() => onNavigate('login')} className="px-10 py-5 text-white font-bold text-lg tracking-tight border border-outline-variant/30 hover:bg-white/5 transition-all active:scale-95">
                Login
              </button>
            </div>
          </div>
          <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-50">
            <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to Explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
          </div>
        </section>
        <section className="py-32 px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-start mb-24">
            <div className="lg:w-1/3">
              <h2 className="text-4xl font-black tracking-tighter text-white leading-none mb-6">THE ARCHITECTURE OF GROWTH</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">We've distilled the technical journey into a high-octane editorial experience. No fluff, just code.</p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative p-8 bg-surface-container-low border-b-2 border-transparent hover:border-primary transition-all duration-500">
                <div className="text-6xl font-black text-white/5 absolute top-4 right-4 group-hover:text-primary/10 transition-colors">01</div>
                <div className="w-12 h-12 flex items-center justify-center bg-surface-container-highest mb-8">
                  <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Upload Resume</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Our AI parses your professional trajectory to identify latent potential and core strengths.</p>
              </div>
              <div className="group relative p-8 bg-surface-container-low border-b-2 border-transparent hover:border-primary transition-all duration-500">
                <div className="text-6xl font-black text-white/5 absolute top-4 right-4 group-hover:text-primary/10 transition-colors">02</div>
                <div className="w-12 h-12 flex items-center justify-center bg-surface-container-highest mb-8">
                  <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Get Assessed</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Dynamic adaptive challenges benchmark your skills against industry-leading engineering standards.</p>
              </div>
              <div className="group relative p-8 bg-surface-container-low border-b-2 border-transparent hover:border-primary transition-all duration-500">
                <div className="text-6xl font-black text-white/5 absolute top-4 right-4 group-hover:text-primary/10 transition-colors">03</div>
                <div className="w-12 h-12 flex items-center justify-center bg-surface-container-highest mb-8">
                  <span className="material-symbols-outlined text-primary text-3xl">auto_stories</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Learn</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">A custom technical curriculum designed to bridge your specific gaps and accelerate mastery.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-8 relative overflow-hidden bg-surface-container-low group">
              <img className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="Close up of a computer screen displaying complex code" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwYdhP1Ogyr28Q-vY-mYQKPttskDH2gCsXV5JD45jLUJwdAGDOYqy49GtCtUuf1ePE3lTgljqKD98hamdSbZCsryinvVhj8tf8auoxTWCGB1lYrS3kb-CMCDnkoB1C8Gn25Do4khBvG4mLIRYiznED05_Tz376v9X2m3BfyRCon6KO4jjBdBPbypTJ6WV6tiqxzYDU_DvDyAfN1oIo8FNPFv5RNShokvAfX8sL-cV15raFFxHhfxr2C8IdCkBnSeTrcq_GgOlRqhE"/>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 max-w-md">
                <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-2 block">System Integrity</span>
                <h4 className="text-3xl font-black text-white tracking-tight mb-4">REAL-TIME PERFORMANCE TELEMETRY</h4>
                <p className="text-on-surface-variant">Track your coding efficiency, complexity management, and architectural thinking with granular precision.</p>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="flex-1 bg-surface-container-high p-8 flex flex-col justify-end border-l-4 border-primary">
                <h4 className="text-xl font-bold text-white mb-2">Technical Editorial</h4>
                <p className="text-on-surface-variant text-sm">In-depth deep dives into distributed systems, low-level optimization, and AI integration.</p>
              </div>
              <div onClick={() => onNavigate('register')} className="flex-1 bg-primary p-8 flex flex-col justify-end group cursor-pointer overflow-hidden relative">
                <span className="material-symbols-outlined absolute top-8 right-8 text-on-primary/20 text-8xl transition-transform group-hover:scale-110">terminal</span>
                <h4 className="text-xl font-black text-on-primary mb-2 relative z-10">ENTER THE ARENA</h4>
                <p className="text-on-primary/80 text-sm font-medium relative z-10">Compete in monthly high-stakes hackathons and climb the global leaderboard.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 border-t border-outline-variant/10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center px-8 relative z-10">
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter">READY TO DECODE YOUR POTENTIAL?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <input className="bg-surface-container-highest border-none text-white px-6 py-4 w-full sm:w-80 focus:ring-2 focus:ring-primary transition-all" placeholder="Enter your engineering email" type="email"/>
              <button onClick={() => onNavigate('register')} className="kinetic-monolith-gradient px-8 py-4 text-on-primary font-bold tracking-tight hover:brightness-110 whitespace-nowrap">Initialize Access</button>
            </div>
            <p className="mt-6 text-zinc-500 text-xs tracking-widest uppercase">Join 150,000+ engineers from top-tier tech hubs</p>
          </div>
        </section>
      </main>
      <footer className="bg-surface-container-lowest py-16 px-8 border-t border-outline-variant/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase mb-4 block">Maverick Coding Platform</span>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">The premier technical assessment and growth platform for elite software developers.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold text-xs uppercase tracking-widest mb-2">Platform</span>
              <a className="text-zinc-500 hover:text-primary transition-colors text-sm" href="#" onClick={comingSoon}>Assessments</a>
              <a className="text-zinc-500 hover:text-primary transition-colors text-sm" href="#" onClick={comingSoon}>Learning Path</a>
              <a className="text-zinc-500 hover:text-primary transition-colors text-sm" href="#" onClick={comingSoon}>Hackathons</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold text-xs uppercase tracking-widest mb-2">Company</span>
              <a className="text-zinc-500 hover:text-primary transition-colors text-sm" href="#" onClick={comingSoon}>About</a>
              <a className="text-zinc-500 hover:text-primary transition-colors text-sm" href="#" onClick={comingSoon}>Editorial</a>
              <a className="text-zinc-500 hover:text-primary transition-colors text-sm" href="#" onClick={comingSoon}>Privacy</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold text-xs uppercase tracking-widest mb-2">Social</span>
              <a className="text-zinc-500 hover:text-primary transition-colors text-sm" href="#" onClick={comingSoon}>Twitter</a>
              <a className="text-zinc-500 hover:text-primary transition-colors text-sm" href="#" onClick={comingSoon}>GitHub</a>
              <a className="text-zinc-500 hover:text-primary transition-colors text-sm" href="#" onClick={comingSoon}>Discord</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span>© 2024 Maverick Technical Editorial. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" onClick={comingSoon}>Security</a>
            <a href="#" onClick={comingSoon}>Status</a>
            <a href="#" onClick={comingSoon}>Uptime: 99.99%</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
