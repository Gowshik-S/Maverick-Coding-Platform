import React from 'react';
import { Screen } from '../App';
import { onboardingState } from '../state/onboarding';

export default function ProfileCreated({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const skills = Object.entries(onboardingState.registerResponse?.skills || {});

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-surface-container-low border border-outline-variant/30 maverick-shadow overflow-hidden relative">
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="p-12 md:p-20 flex flex-col items-center text-center relative z-10">
          
          <div className="w-24 h-24 bg-surface-container-highest rounded-full flex items-center justify-center mb-8 border-4 border-surface-container-low shadow-[0_0_0_2px_var(--color-tertiary)] relative">
            <span className="material-symbols-outlined text-tertiary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div className="absolute inset-0 rounded-full border border-tertiary animate-ping opacity-20"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4 uppercase">Profile Created!</h1>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-12">
            We've mapped your core competencies. Your personalized technical journey is ready to begin.
          </p>

          <div className="w-full max-w-2xl bg-surface-container-highest p-5 border border-outline-variant/30 mb-8">
            <h3 className="text-xs font-bold tracking-widest text-outline uppercase mb-3 text-left">Detected Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.length ? skills.map(([skill, level]) => (
                <span key={skill} className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs font-bold">
                  {skill}: {String(level)}
                </span>
              )) : <span className="text-xs text-on-surface-variant">No extracted skills available</span>}
            </div>
          </div>

          {/* Journey Visualization */}
          <div className="w-full max-w-2xl bg-surface-container-highest p-8 border border-outline-variant/30 mb-12 relative">
            <h3 className="text-xs font-bold tracking-widest text-outline uppercase mb-8 text-left">Your Progression Path</h3>
            
            <div className="flex justify-between items-center relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant/30 -translate-y-1/2 z-0"></div>
              <div className="absolute top-1/2 left-0 w-1/3 h-0.5 bg-primary -translate-y-1/2 z-0"></div>

              {/* Node 1 */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(250,153,73,0.4)]">
                  <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Profile</span>
              </div>

              {/* Node 2 */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center shadow-[0_0_15px_rgba(250,153,73,0.2)]">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Assess</span>
              </div>

              {/* Node 3 */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-outline-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline-variant text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                </div>
                <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Learn</span>
              </div>

              {/* Node 4 */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-outline-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline-variant text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                </div>
                <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Master</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button onClick={() => onNavigate('assessment-ide')} className="flex-1 kinetic-monolith-gradient text-on-primary font-black tracking-widest uppercase text-sm py-4 px-6 transition-all hover:brightness-110 active:scale-[0.98] flex justify-center items-center gap-2">
              START ASSESSMENT
              <span className="material-symbols-outlined text-sm">play_arrow</span>
            </button>
            <button onClick={() => onNavigate('dashboard')} className="flex-1 bg-surface-container-highest border border-outline-variant/50 text-white font-bold tracking-widest uppercase text-sm py-4 px-6 transition-colors hover:bg-surface-container-high hover:border-outline flex justify-center items-center gap-2">
              DASHBOARD
            </button>
          </div>
          
          <p className="mt-6 text-xs text-on-surface-variant">
            Your first assessment will take approximately 15 minutes.
          </p>

        </div>
      </div>
    </div>
  );
}
