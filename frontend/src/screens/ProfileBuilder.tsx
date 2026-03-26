import React from 'react';
import { Screen } from '../App';
import { registerUser } from '../lib/api';
import { saveSession } from '../lib/session';
import { onboardingState } from '../state/onboarding';

type ProfileBuilderProps = {
  onNavigate: (s: Screen) => void;
  onNotify?: (message: string) => void;
};

export default function ProfileBuilder({ onNavigate, onNotify }: ProfileBuilderProps) {
  const [file, setFile] = React.useState<File | null>(onboardingState.resumeFile);
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    const draft = onboardingState.draft;
    if (!draft) {
      onNotify?.('Complete account details first');
      onNavigate('register');
      return;
    }
    if (!file) {
      onNotify?.('Please upload your resume');
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

      if (response.needs_more_info) {
        onNavigate('extraction-analysis');
        return;
      }

      if (response.user_id) {
        saveSession({
          user_id: response.user_id,
          name: response.name || draft.name,
          email: response.email || draft.email,
          skills: response.skills || {},
        });
        onNavigate('profile-created');
        return;
      }

      onNotify?.(response.error || response.detail || 'Registration failed');
    } catch (err: any) {
      onNotify?.(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-surface-container-low border border-outline-variant/30 maverick-shadow overflow-hidden">
        
        {/* Left Panel - Progress */}
        <div className="hidden md:flex w-1/4 p-8 border-r border-outline-variant/30 flex-col justify-between bg-surface-container-lowest relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-surface-container-highest">
            <div className="h-full bg-primary w-2/3"></div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>code_blocks</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">Maverick</span>
            </div>

            <h2 className="text-xs font-bold tracking-widest text-outline uppercase mb-8">Registration Progress</h2>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary before:to-surface-container-highest">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary bg-primary text-on-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-odd:pr-4 md:group-even:pl-4">
                  <h3 className="font-bold text-white text-xs">Account Details</h3>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary bg-surface-container-lowest text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-odd:pr-4 md:group-even:pl-4">
                  <h3 className="font-bold text-white text-xs">Profile Builder</h3>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-outline-variant bg-surface-container-lowest text-outline-variant shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="material-symbols-outlined text-[12px]">circle</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-odd:pr-4 md:group-even:pl-4">
                  <h3 className="font-bold text-outline text-xs">Review &amp; Submit</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-outline-variant/30">
            <button onClick={() => onNavigate('register')} className="text-xs text-outline hover:text-white transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Step 1
            </button>
          </div>
        </div>

        {/* Center Panel - Upload Area */}
        <div className="w-full md:w-2/4 p-10 flex flex-col">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase mb-2">Profile Builder</h1>
            <p className="text-on-surface-variant text-sm">
              Upload your resume. Our AI will extract your skills, experience, and generate a personalized assessment path.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-primary/5 rounded-none border-2 border-dashed border-primary/30 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300"></div>
              
              <div className="relative p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Drop your resume here</h3>
                <p className="text-on-surface-variant text-sm mb-6">or click to browse from your computer</p>
                
                <div className="flex gap-4 text-xs font-bold text-outline uppercase tracking-widest">
                  <span className="bg-surface-container-highest px-3 py-1">PDF</span>
                  <span className="bg-surface-container-highest px-3 py-1">DOCX</span>
                  <span className="bg-surface-container-highest px-3 py-1">TXT</span>
                </div>
              </div>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.txt"
                title="Upload resume file"
                aria-label="Upload resume file"
                onChange={(e) => {
                  const selected = e.target.files?.[0] || null;
                  setFile(selected);
                }}
              />
            </div>

            {file ? <p className="mt-3 text-xs text-on-surface-variant">Selected: <span className="text-white">{file.name}</span></p> : null}

            <div className="mt-8 flex items-center gap-4 bg-surface-container-highest p-4 border-l-2 border-tertiary">
              <span className="material-symbols-outlined text-tertiary">lock</span>
              <p className="text-xs text-on-surface-variant">
                Your data is encrypted and securely processed. We do not share your resume with third parties without explicit consent.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button onClick={submit} disabled={loading} className="kinetic-monolith-gradient text-on-primary font-black tracking-widest uppercase text-sm py-4 px-8 transition-all hover:brightness-110 active:scale-[0.98] flex items-center gap-2 disabled:opacity-70">
              {loading ? 'ANALYZING...' : 'UPLOAD & ANALYZE'}
              <span className="material-symbols-outlined text-sm">memory</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Info/Visual */}
        <div className="hidden md:flex w-1/4 bg-surface-container-highest border-l border-outline-variant/30 flex-col relative overflow-hidden">
          <img className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwYdhP1Ogyr28Q-vY-mYQKPttskDH2gCsXV5JD45jLUJwdAGDOYqy49GtCtUuf1ePE3lTgljqKD98hamdSbZCsryinvVhj8tf8auoxTWCGB1lYrS3kb-CMCDnkoB1C8Gn25Do4khBvG4mLIRYiznED05_Tz376v9X2m3BfyRCon6KO4jjBdBPbypTJ6WV6tiqxzYDU_DvDyAfN1oIo8FNPFv5RNShokvAfX8sL-cV15raFFxHhfxr2C8IdCkBnSeTrcq_GgOlRqhE" alt="Abstract Code Background" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container-highest via-transparent to-surface-container-highest"></div>
          
          <div className="relative z-10 p-8 flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Active Processing</span>
              </div>
              <h4 className="text-white font-bold text-lg leading-tight">Data Integrity</h4>
            </div>
            
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-outline-variant text-xl">document_scanner</span>
                <div>
                  <p className="text-sm font-bold text-white">Format Agnostic</p>
                  <p className="text-xs text-on-surface-variant mt-1">Our parser handles complex layouts and non-standard formatting.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-outline-variant text-xl">account_tree</span>
                <div>
                  <p className="text-sm font-bold text-white">Skill Taxonomy</p>
                  <p className="text-xs text-on-surface-variant mt-1">Maps your experience to a standardized engineering taxonomy.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-outline-variant text-xl">speed</span>
                <div>
                  <p className="text-sm font-bold text-white">Real-time Analysis</p>
                  <p className="text-xs text-on-surface-variant mt-1">Extraction completes in under 3 seconds on average.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
