import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, FileText, UploadCloud } from 'lucide-react';

export default function Step2() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#1b1b1c] flex justify-between items-center h-14 px-6 max-w-full">
        <div className="text-xl font-bold text-[#e5e2e1] tracking-tight font-headline">
          Maverick Coding Platform
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-[#dac2b2] hover:text-[#e5e2e1] transition-colors text-sm font-medium">Features</a>
          <a href="#" className="text-[#dac2b2] hover:text-[#e5e2e1] transition-colors text-sm font-medium">Solutions</a>
          <a href="#" className="text-[#dac2b2] hover:text-[#e5e2e1] transition-colors text-sm font-medium">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#dac2b2] hover:text-[#e5e2e1] transition-colors text-sm font-medium px-4 py-2">Log In</button>
          <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-sm text-sm font-bold active:scale-95 transition-transform">Sign Up</button>
        </div>
      </nav>

      <main className="min-h-screen pt-14 flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-80 bg-surface-container border-r border-transparent p-8">
          <div className="mb-12">
            <h2 className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-6">Registration Progress</h2>
            <div className="space-y-8">
              {/* Step 1 Complete */}
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-on-surface font-semibold text-sm">Account Details</p>
                  <p className="text-on-surface-variant text-xs">Step 1 Complete</p>
                </div>
              </div>

              {/* Step 2 Active */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-primary-container flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div>
                </div>
                <div>
                  <p className="text-primary font-bold text-sm">Profile Builder</p>
                  <p className="text-on-surface-variant text-xs">Step 2 in progress</p>
                </div>
              </div>

              {/* Step 3 Pending */}
              <div className="flex items-center gap-4 opacity-40">
                <div className="w-8 h-8 rounded-full border-2 border-outline flex items-center justify-center"></div>
                <div>
                  <p className="text-on-surface font-semibold text-sm">Review & Submit</p>
                  <p className="text-on-surface-variant text-xs">Step 3</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 bg-surface-container-low rounded-lg border border-outline-variant/20">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="text-primary font-bold">Pro Tip:</span> Our AI-driven parser works best with standard PDF or DOCX formats to accurately map your technical stack.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-surface-container-low">
          <div className="w-full max-w-2xl space-y-8">
            <header className="text-center lg:text-left space-y-2">
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Profile Builder</h1>
              <p className="text-on-surface-variant">Let our engine extract your professional DNA and build your profile automatically.</p>
            </header>

            <div className="custom-dashed group hover:bg-surface-container transition-all duration-300 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer min-h-[320px]">
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2 flex items-center gap-2">
                <UploadCloud className="w-6 h-6 text-primary" />
                Drop your resume here
              </h3>
              <p className="text-on-surface-variant text-sm mb-8">or drag and drop from your local machine</p>
              <button className="bg-surface-variant hover:bg-surface-bright text-on-surface px-6 py-2.5 rounded-sm font-semibold text-sm border border-outline-variant/30 transition-colors">
                Browse Files
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-outline-variant/20">
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant border border-outline-variant/20 tracking-tighter">PDF</span>
                <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant border border-outline-variant/20 tracking-tighter">TXT</span>
                <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant border border-outline-variant/20 tracking-tighter">DOCX</span>
                <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant border border-outline-variant/20 tracking-tighter">JPG</span>
                <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant border border-outline-variant/20 tracking-tighter">PNG</span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">Max file size: <span className="text-on-surface">5MB</span></p>
            </div>

            <div className="text-center">
              <a href="#" className="text-tertiary hover:underline text-sm font-medium flex items-center justify-center gap-2 group">
                Don't have a resume? Fill skills manually
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
              <Link to="/step-1" className="w-full md:w-auto order-2 md:order-1 flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors px-6 py-3 font-bold text-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Step 1
              </Link>
              <button className="w-full md:w-auto order-1 md:order-2 bg-primary-container hover:brightness-110 text-on-primary-container px-10 py-3.5 rounded-sm font-extrabold text-sm tracking-wide shadow-xl shadow-primary-container/10 flex items-center justify-center gap-2 active:scale-95 transition-all">
                UPLOAD & ANALYZE
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Right Sidebar (Active Processing) */}
        <div className="hidden xl:block w-72 bg-surface p-8">
          <div className="sticky top-24 space-y-6">
            <h4 className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Active Processing</h4>
            
            <div className="p-4 bg-surface-container-high rounded-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-tertiary">SYSTEM_STATUS</span>
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              </div>
              <div className="space-y-2">
                <div className="h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div className="h-full bg-outline-variant w-1/3"></div>
                </div>
                <p className="text-[10px] font-mono text-on-surface-variant">Awaiting input stream...</p>
              </div>
            </div>

            <div className="relative group rounded-lg overflow-hidden border border-outline-variant/30">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb02S2WWQdEx3Cav9k2aZcBau1q9WP8mGYcdnFvlKv66xAAcuAFv7P62WLeQq3K8duNyNf-Qt4S9IHi9wv97VT2Y15oAArSP0n6ZOmFurX4Vh0oXNNqrcdaW_LRJjftHv2SXNkcaJStXK3KQ3pZqvUGYNYQlsVFb_KpAxo7ZEG6LFKPK_KQEPtt2R_lK4BGvJwmtQL2tyrWbG1zi4RaBqwi_IGqo_6Vq6m9cb2kDUHGYi8uAB132-QqmuAnZYh-VRsNkwEfpBUZQ" 
                alt="Data Integrity" 
                className="w-full h-48 object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Data Integrity</p>
                <p className="text-xs text-on-surface font-medium leading-tight">Your data is encrypted and used only for career matching.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
