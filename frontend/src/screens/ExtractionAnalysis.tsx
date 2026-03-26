import React from 'react';
import { Screen } from '../App';
import { registerUser } from '../lib/api';
import { saveSession } from '../lib/session';
import { onboardingState } from '../state/onboarding';

type ExtractionProps = {
  onNavigate: (s: Screen) => void;
  onNotify?: (message: string) => void;
};

export default function ExtractionAnalysis({ onNavigate, onNotify }: ExtractionProps) {
  const response = onboardingState.registerResponse;
  const missing = response?.missing || [];
  const draft = onboardingState.draft;
  const resumeFile = onboardingState.resumeFile;
  const skills = Object.keys(response?.skills || {});

  const [extraSkills, setExtraSkills] = React.useState('');
  const [extraExperience, setExtraExperience] = React.useState('');
  const [extraEducation, setExtraEducation] = React.useState('');
  const [extraRole, setExtraRole] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!draft || !resumeFile) {
      onNotify?.('Please upload your resume first');
      onNavigate('profile-builder');
      return;
    }

    try {
      setLoading(true);
      const finalResponse = await registerUser({
        name: draft.name,
        email: draft.email,
        resume: resumeFile,
        extra_skills: extraSkills,
        extra_experience: extraExperience,
        extra_education: extraEducation,
        extra_role: extraRole,
      });
      onboardingState.registerResponse = finalResponse;

      if (finalResponse.user_id) {
        saveSession({
          user_id: finalResponse.user_id,
          name: finalResponse.name || draft.name,
          email: finalResponse.email || draft.email,
          skills: finalResponse.skills || {},
        });
        onNavigate('profile-created');
        return;
      }

      onNotify?.(finalResponse.error || finalResponse.detail || 'Could not complete profile setup');
    } catch (err: any) {
      onNotify?.(err.message || 'Could not complete profile setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-surface-container-low border border-outline-variant/30 maverick-shadow overflow-hidden">
        
        {/* Left Panel - Extracted Data */}
        <div className="w-full md:w-1/3 p-10 border-r border-outline-variant/30 flex flex-col bg-surface-container-lowest relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-surface-container-highest">
            <div className="h-full bg-tertiary w-full"></div>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>code_blocks</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">Maverick</span>
            </div>

            <h2 className="text-sm font-bold tracking-widest text-outline uppercase mb-2">Extraction Analysis</h2>
            <p className="text-xs text-on-surface-variant">Review the data parsed from your resume.</p>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="bg-surface-container-highest p-4 border-l-2 border-tertiary">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Successfully Extracted</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-outline">Name</span>
                  <span className="text-white font-medium">{draft?.name || response?.partial_name || 'Unknown'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-outline">Email</span>
                  <span className="text-white font-medium">{draft?.email || 'Unknown'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-outline">Languages</span>
                  <span className="text-white font-medium">{skills.slice(0, 3).join(', ') || 'Not available'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-surface-container-highest p-4 border-l-2 border-error">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-error text-sm">warning</span>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Action Required</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">We couldn't confidently extract the following fields. Please provide them manually.</p>
              <ul className="space-y-2 text-xs font-medium text-error">
                {missing.length ? missing.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-error rounded-full"></span>
                    {item}
                  </li>
                )) : (
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-error rounded-full"></span>
                    No missing fields detected
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-outline-variant/30">
            <button onClick={() => onNavigate('profile-builder')} className="text-xs text-outline hover:text-white transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Upload
            </button>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-2/3 p-10 md:p-16 flex flex-col justify-center">
          <div className="max-w-xl w-full mx-auto">
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">Complete your technical identity</h1>
            <p className="text-on-surface-variant text-sm mb-10">
              Refine your profile to ensure you receive the most relevant assessments and learning paths.
            </p>

            <form className="space-y-8" onSubmit={submit}>
              
              {/* Skills */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center justify-between">
                  Primary Skills
                  <span className="text-primary cursor-pointer hover:underline">Edit</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(skills.length ? skills : ['Not detected']).map((skill) => (
                    <div key={skill} className="bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 text-xs font-bold flex items-center gap-2">
                      {skill}
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full bg-surface-container-highest border border-outline-variant/50 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary block p-3 transition-colors"
                  placeholder="Add extra skills (comma separated)"
                  value={extraSkills}
                  onChange={(e) => setExtraSkills(e.target.value)}
                />
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-error uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[12px]">error</span>
                  Years of Experience
                </label>
                <input
                  type="text"
                  className="w-full bg-surface-container-highest border border-outline-variant/50 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary block p-3 transition-colors"
                  placeholder="e.g. 3-5 years"
                  value={extraExperience}
                  onChange={(e) => setExtraExperience(e.target.value)}
                  required={missing.some((item) => item.toLowerCase().includes('experience'))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education */}
                <div className="space-y-3">
                  <label htmlFor="education" className="text-[10px] font-bold text-error uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-[12px]">error</span>
                    Highest Education
                  </label>
                  <div className="relative">
                    <select id="education" className="w-full bg-surface-container-highest border border-outline-variant/50 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary block p-3 appearance-none transition-colors" value={extraEducation} onChange={(e) => setExtraEducation(e.target.value)} required={missing.some((item) => item.toLowerCase().includes('education'))}>
                      <option value="" disabled>Select degree</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">Ph.D.</option>
                      <option value="bootcamp">Bootcamp Graduate</option>
                      <option value="self">Self-Taught</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-outline-variant text-lg">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Target Role */}
                <div className="space-y-3">
                  <label htmlFor="targetRole" className="text-[10px] font-bold text-error uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-[12px]">error</span>
                    Target Role
                  </label>
                  <input type="text" id="targetRole" className="w-full bg-surface-container-highest border border-outline-variant/50 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary block p-3 transition-colors" placeholder="e.g. Backend Engineer" value={extraRole} onChange={(e) => setExtraRole(e.target.value)} required={missing.some((item) => item.toLowerCase().includes('role'))} />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="w-full kinetic-monolith-gradient text-on-primary font-black tracking-widest uppercase text-sm py-4 px-4 transition-all hover:brightness-110 active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70">
                  {loading ? 'SUBMITTING...' : 'COMPLETE PROFILE'}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
