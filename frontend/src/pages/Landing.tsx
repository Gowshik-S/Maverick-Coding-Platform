import { Link } from 'react-router-dom';
import { Terminal, ArrowRight, FileText, Activity, Home } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex justify-between items-center h-16 px-6 lg:px-12 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">Maverick Coding Platform</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Solutions</a>
          <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2">
            Log In
          </Link>
          <Link to="/register" className="bg-primary-container text-on-primary-container px-4 py-2 rounded text-sm font-bold hover:brightness-110 transition-all">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Built for developers
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Maverick <span className="text-primary-container">Coding Platform</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            AI-Powered Skill Assessment & Personalized Learning paths. Carved from code for the modern software engineer.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-8">
            <Link to="/register" className="bg-primary-container text-on-primary-container px-8 py-4 rounded font-bold flex items-center gap-2 hover:brightness-110 transition-all">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="bg-surface-container-high text-on-surface px-8 py-4 rounded font-bold hover:bg-surface-bright transition-all">
              Login
            </Link>
          </div>
        </div>

        <div className="w-full max-w-4xl mt-20 bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden shadow-2xl">
          <div className="bg-surface-container-high px-4 py-3 flex items-center gap-2 border-b border-outline-variant/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
              <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
              <div className="w-3 h-3 rounded-full bg-tertiary-container/50"></div>
            </div>
            <div className="flex-1 text-center text-[10px] font-mono text-on-surface-variant">assessment_engine.sh</div>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
            <div className="flex">
              <span className="text-surface-variant select-none pr-4 text-right w-8">1</span>
              <span className="text-secondary">import</span> <span className="text-on-surface">{"{ AI_Engine }"}</span> <span className="text-secondary">from</span> <span className="text-tertiary">"@maverick/core"</span><span className="text-on-surface">;</span>
            </div>
            <div className="flex">
              <span className="text-surface-variant select-none pr-4 text-right w-8">2</span>
              <span className="text-outline-variant italic">// Initialize developer profile via resume parsing</span>
            </div>
            <div className="flex">
              <span className="text-surface-variant select-none pr-4 text-right w-8">3</span>
              <span className="text-secondary">const</span> <span className="text-on-surface">profile =</span> <span className="text-secondary">await</span> <span className="text-on-surface">AI_Engine.</span><span className="text-primary-container">parseSkills</span><span className="text-on-surface">(uploadedResume);</span>
            </div>
            <div className="flex">
              <span className="text-surface-variant select-none pr-4 text-right w-8">4</span>
              <span className="text-secondary">const</span> <span className="text-on-surface">path = AI_Engine.</span><span className="text-primary-container">generateLearningPath</span><span className="text-on-surface">(profile.gaps);</span>
            </div>
            <div className="flex">
              <span className="text-surface-variant select-none pr-4 text-right w-8">5</span>
              <span className="text-secondary">return</span> <span className="text-tertiary">"Evolution initiated..."</span><span className="text-on-surface">;</span>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-surface-container-low py-24 px-6 lg:px-12 border-t border-outline-variant/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="text-5xl font-black text-surface-container-highest">01</div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              Upload Resume <FileText className="w-5 h-5 text-primary-container" />
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Our proprietary AI decodes your career history to identify latent skills and technical strengths with surgical precision.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-black text-surface-container-highest">02</div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              Get Assessed <Terminal className="w-5 h-5 text-primary-container" />
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Engage with adaptive coding challenges that scale in real-time based on your performance. No generic quizzes.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-black text-surface-container-highest">03</div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              Learn <Home className="w-5 h-5 text-primary-container" />
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Receive a hyper-personalized roadmap designed to close your specific gaps and accelerate your mastery.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 lg:px-12 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-mono">
          © 2024 Maverick Coding Platform. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          <a href="#" className="hover:text-primary transition-colors">API</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
}
