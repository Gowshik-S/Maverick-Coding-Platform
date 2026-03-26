import React from 'react';
import { Screen } from '../App';
import { getLeaderboard, getLearningPath, getUser } from '../lib/api';
import { clearSession, loadSession } from '../lib/session';

type DashboardProps = {
  onNavigate: (s: Screen) => void;
  onNotify?: (message: string) => void;
};

export default function Dashboard({ onNavigate, onNotify }: DashboardProps) {
  const [userName, setUserName] = React.useState('MavUser');
  const [points, setPoints] = React.useState(0);
  const [learningPath, setLearningPath] = React.useState<any[]>([]);
  const [leaderboard, setLeaderboard] = React.useState<any[]>([]);

  const comingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    onNotify?.('Coming soon');
  };

  React.useEffect(() => {
    const session = loadSession();
    if (!session?.user_id) {
      onNotify?.('Please login first');
      onNavigate('login');
      return;
    }

    (async () => {
      const [userResult, pathResult, boardResult] = await Promise.allSettled([
        getUser(session.user_id),
        getLearningPath(session.user_id),
        getLeaderboard(),
      ]);

      if (userResult.status === 'rejected') {
        onNotify?.(userResult.reason?.message || 'Failed to load user profile');
      }
      if (pathResult.status === 'rejected') {
        onNotify?.(pathResult.reason?.message || 'Failed to load learning path');
      }
      if (boardResult.status === 'rejected') {
        onNotify?.(boardResult.reason?.message || 'Failed to load leaderboard');
      }

      const user = userResult.status === 'fulfilled' ? userResult.value : null;
      const pathData = pathResult.status === 'fulfilled' ? pathResult.value : null;
      const boardData = boardResult.status === 'fulfilled' ? boardResult.value : [];

      const name = user?.name || session.name || 'MavUser';
      setUserName(name);

      const board = Array.isArray(boardData) ? boardData : [];
      setLeaderboard(board);

      const myRank = board.find((row: any) => row?.name === name);
      setPoints(Number(myRank?.score || 0));

      const path = Array.isArray(pathData?.learning_path) ? pathData.learning_path : [];
      setLearningPath(path);
    })();
  }, [onNavigate, onNotify]);

  return (
    <div className="bg-background text-on-surface overflow-hidden flex h-screen">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-[200px] bg-[#202020] flex-col py-4 z-40 hidden md:flex">
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">code</span>
            </div>
            <div>
              <div className="text-on-surface font-black text-xs uppercase tracking-widest">&nbsp;Mavericks</div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Coding Platform</div>
            </div>
          </div>
        </div>
        <nav className="flex-grow space-y-1">
          <a className="bg-[#37373d] text-[#e5e2e1] rounded-none border-l-2 border-[#e6883a] flex items-center gap-3 px-4 py-3 font-['Inter'] text-xs font-bold uppercase tracking-widest transition-all duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a onClick={() => onNavigate('assessment-ide')} className="text-[#dac2b2] hover:bg-[#2a2d2e] flex items-center gap-3 px-4 py-3 font-['Inter'] text-xs font-bold uppercase tracking-widest transition-all duration-200 ease-in-out cursor-pointer">
            <span className="material-symbols-outlined">terminal</span>
            Assessments
          </a>
          <a onClick={comingSoon} className="text-[#dac2b2] hover:bg-[#2a2d2e] flex items-center gap-3 px-4 py-3 font-['Inter'] text-xs font-bold uppercase tracking-widest transition-all duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">map</span>
            Learning Path
          </a>
          <a onClick={comingSoon} className="text-[#dac2b2] hover:bg-[#2a2d2e] flex items-center gap-3 px-4 py-3 font-['Inter'] text-xs font-bold uppercase tracking-widest transition-all duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">code</span>
            Hackathons
          </a>
          <a onClick={comingSoon} className="text-[#dac2b2] hover:bg-[#2a2d2e] flex items-center gap-3 px-4 py-3 font-['Inter'] text-xs font-bold uppercase tracking-widest transition-all duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">leaderboard</span>
            Leaderboard
          </a>
        </nav>
        <div className="mt-auto border-t border-outline-variant/10">
          {/* User Profile in Sidebar */}
          <div className="px-4 py-4 flex items-center gap-3 border-b border-outline-variant/10">
            <div className="w-8 h-8 rounded bg-surface-container-high overflow-hidden shrink-0">
              <img alt="Current User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaNQo4HsViJosONnKZpK0Vm1hv5m2UxHfhvREk5I534kkAG3-Vgj8mwLMakeAzHScgxLZ_GKg3HuE3Q1jlWfz0gqoNwSEDCF49WO8j0d4RFUSA01A1NdaR0eGPAFJNRHbTNA8s_AzK7zncBCUuh-kLlKBvmAtw1-rgAuBnS7FwD1lksewiQx05GR__vlyEsAffhqNIWdTDlUE496n74AfXZjt_8g8om5laCOiCo3SEjv4WsXLUPgd2WXBRDJE_8EsPWRLwfuXZog" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{userName}</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-tighter">Pro Developer</p>
            </div>
          </div>
          <a onClick={comingSoon} className="text-[#dac2b2] hover:bg-[#2a2d2e] flex items-center gap-3 px-4 py-3 font-['Inter'] text-xs font-bold uppercase tracking-widest" href="#">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
          <a
            onClick={(e) => {
              e.preventDefault();
              clearSession();
              onNavigate('landing');
            }}
            className="text-[#dac2b2] hover:bg-[#2a2d2e] flex items-center gap-3 px-4 py-3 font-['Inter'] text-xs font-bold uppercase tracking-widest"
            href="#"
          >
            <span className="material-symbols-outlined">help</span>
            Sign Out
          </a>
        </div>
      </aside>
      
      {/* Main Canvas */}
      <main className="ml-0 md:ml-[200px] h-screen overflow-y-auto custom-scrollbar p-6 flex-1">
        {/* Header with Greeting and Profile */}
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Welcome, {userName}</h1>
            <p className="text-sm text-on-surface-variant">Your daily coding digest is ready.</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Points */}
            <div className="text-right border-r border-outline-variant/20 pr-6">
              <span className="text-primary font-black text-2xl">{points}</span>
              <span className="text-[10px] block text-on-surface-variant uppercase font-bold">Points Earned</span>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors relative">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">notifications</span>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-background"></span>
                </button>
                {/* Notification Dropdown */}
                <div className="absolute right-0 mt-2 w-64 bg-surface-bright border border-outline-variant/20 rounded-lg shadow-2xl z-50 overflow-hidden hidden group-hover:block">
                  <div className="p-3 border-b border-outline-variant/10">
                    <h4 className="text-xs font-black uppercase tracking-widest">Recent Activity</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    <a onClick={() => onNavigate('assessment-ide')} className="block p-3 hover:bg-surface-container transition-colors border-b border-outline-variant/5 cursor-pointer">
                      <p className="text-xs font-bold">Assessment Graded</p>
                      <p className="text-[10px] text-on-surface-variant">Python Algorithms: 98% Score</p>
                      <p className="text-[9px] text-primary mt-1">2 hours ago</p>
                    </a>
                    <a onClick={() => onNavigate('assessment-ide')} className="block p-3 hover:bg-surface-container transition-colors border-b border-outline-variant/5 cursor-pointer">
                      <p className="text-xs font-bold">New Hackathon Live</p>
                      <p className="text-[10px] text-on-surface-variant">Join "Maverick Code Sprint"</p>
                      <p className="text-[9px] text-primary mt-1">5 hours ago</p>
                    </a>
                    <a className="block p-3 hover:bg-surface-container transition-colors" href="#">
                      <p className="text-xs font-bold">Level Up!</p>
                      <p className="text-[10px] text-on-surface-variant">You've reached 'Pro' status.</p>
                      <p className="text-[9px] text-primary mt-1">Yesterday</p>
                    </a>
                  </div>
                </div>
              </div>
              {/* User Info Header */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold">{userName}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pro</p>
                </div>
                <div className="w-10 h-10 rounded bg-surface-container-high overflow-hidden border border-outline-variant/20">
                  <img alt="Current User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaNQo4HsViJosONnKZpK0Vm1hv5m2UxHfhvREk5I534kkAG3-Vgj8mwLMakeAzHScgxLZ_GKg3HuE3Q1jlWfz0gqoNwSEDCF49WO8j0d4RFUSA01A1NdaR0eGPAFJNRHbTNA8s_AzK7zncBCUuh-kLlKBvmAtw1-rgAuBnS7FwD1lksewiQx05GR__vlyEsAffhqNIWdTDlUE496n74AfXZjt_8g8om5laCOiCo3SEjv4WsXLUPgd2WXBRDJE_8EsPWRLwfuXZog" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Top Section: Assessments & Hackathon */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-6 items-stretch">
          {/* Assessment Panel */}
          <div className="lg:col-span-6 flex">
            <div className="bg-surface-container-low rounded-lg overflow-hidden flex flex-col w-full">
              <div className="flex border-b border-outline-variant/10">
                <button className="px-6 py-4 text-sm font-bold border-b-2 border-primary-container bg-surface-container">Upcoming</button>
                <button className="px-6 py-4 text-sm font-bold text-on-surface-variant hover:text-on-surface">Past</button>
              </div>
              <div className="p-6 space-y-6 flex-grow">
                {/* Current Assessment Section */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3">Current Assessment</h3>
                  <div className="bg-surface-container border border-primary-container/30 rounded-lg p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-container rounded flex items-center justify-center shadow-lg shadow-primary-container/10">
                        <span className="material-symbols-outlined text-on-primary">javascript</span>
                      </div>
                      <div>
                        <h4 className="text-base font-black">Node.js Performance Optimization</h4>
                        <p className="text-xs text-on-surface-variant">Estimated duration: 45 mins • Advanced Level</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                          <span className="text-[10px] font-bold text-primary uppercase">Active Now</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => onNavigate('assessment-ide')} className="px-6 py-3 bg-primary-container text-on-primary text-xs font-black uppercase rounded shadow-lg shadow-primary-container/20 hover:brightness-110 active:scale-95 transition-all">Continue</button>
                  </div>
                </div>
                {/* Upcoming Assessments Section */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3">Upcoming Assessments</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-surface-container/50 border border-outline-variant/10 rounded-lg group hover:bg-surface-container transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-surface-container-highest rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-tertiary">database</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">SQL Indexing &amp; Query Tuning</h4>
                          <p className="text-xs text-on-surface-variant">Unlocks in 24 hours</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase rounded cursor-not-allowed">Locked</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Hackathon Card */}
          <div className="lg:col-span-4 flex">
            <div className="bg-surface-container-low rounded-lg border-t-4 border-primary-container overflow-hidden w-full flex flex-col">
              <div className="p-6 relative flex flex-col h-full">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-black">Maverick Code Sprint 2023</h3>
                    <p className="text-xs text-on-surface-variant">Build the next generation AI coding assistant.</p>
                  </div>
                  <div className="bg-error/10 text-error px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shrink-0 mt-1">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                    ENDING SOON
                  </div>
                </div>
                <div className="flex gap-4 mb-8">
                  <div className="flex-1 bg-surface-container p-3 rounded text-center">
                    <p className="text-xl font-black text-primary">04</p>
                    <p className="text-[9px] text-on-surface-variant uppercase font-bold">Hours</p>
                  </div>
                  <div className="flex-1 bg-surface-container p-3 rounded text-center">
                    <p className="text-xl font-black text-primary">22</p>
                    <p className="text-[9px] text-on-surface-variant uppercase font-bold">Mins</p>
                  </div>
                  <div className="flex-1 bg-surface-container p-3 rounded text-center">
                    <p className="text-xl font-black text-primary">59</p>
                    <p className="text-[9px] text-on-surface-variant uppercase font-bold">Secs</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <button onClick={() => onNotify?.('Coming soon')} className="w-full py-4 bg-secondary-container text-on-secondary font-black uppercase text-sm rounded hover:brightness-110 transition-all flex items-center justify-center gap-2">
                    Join Hackathon
                    <span className="material-symbols-outlined">rocket_launch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Stages Progress Tracker */}
        <section className="bg-surface-container-low rounded-lg py-6 px-10 mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant text-center mb-6">Your Progression Journey</h3>
          <div className="max-w-4xl mx-auto flex items-center justify-between relative px-4">
            {/* Node 1 */}
            <div className="flex flex-col items-center group relative cursor-pointer z-10">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-container/20">1</div>
              <div className="absolute -bottom-8 whitespace-nowrap text-center">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Stage 1</p>
                <p className="text-xs font-semibold">Profile Created</p>
              </div>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-surface-bright text-[10px] p-2 rounded shadow-xl border border-outline-variant/20 whitespace-nowrap">
                Completed on Oct 12, 2023
              </div>
            </div>
            {/* Line 1-2 */}
            <div className="flex-1 h-px bg-primary-container opacity-50 mx-2"></div>
            {/* Node 2 */}
            <div onClick={() => onNavigate('assessment-ide')} className="flex flex-col items-center group relative cursor-pointer z-10">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-container/20">2</div>
              <div className="absolute -bottom-8 whitespace-nowrap text-center">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Stage 2</p>
                <p className="text-xs font-semibold">Assessment Done</p>
              </div>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-surface-bright text-[10px] p-2 rounded shadow-xl border border-outline-variant/20 whitespace-nowrap">
                In Progress - 75% Complete
              </div>
            </div>
            {/* Line 2-3 */}
            <div className="flex-1 h-px bg-outline-variant mx-2"></div>
            {/* Node 3 */}
            <div className="flex flex-col items-center group relative cursor-pointer opacity-50 z-10">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-sm font-bold">3</div>
              <div className="absolute -bottom-8 whitespace-nowrap text-center">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Stage 3</p>
                <p className="text-xs font-semibold">Skills Evaluated</p>
              </div>
            </div>
            {/* Line 3-4 */}
            <div className="flex-1 h-px bg-outline-variant mx-2"></div>
            {/* Node 4 */}
            <div className="flex flex-col items-center group relative cursor-pointer opacity-50 z-10">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-sm font-bold">4</div>
              <div className="absolute -bottom-8 whitespace-nowrap text-center">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Final</p>
                <p className="text-xs font-semibold">Learning Path</p>
              </div>
            </div>
          </div>
          <div className="h-8"></div>
        </section>

        {/* Bottom Section: Learning Path & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
          {/* Recommended Learning Path */}
          <div className="lg:col-span-6 flex">
            <div className="bg-surface-container-low rounded-lg p-6 w-full">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">route</span>
                Recommended Learning Path
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black">
                      <th className="px-4 pb-2">Module Name</th>
                      <th className="px-4 pb-2">Topic</th>
                      <th className="px-4 pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learningPath.length ? learningPath.slice(0, 4).map((module: any, index: number) => (
                      <tr key={`${module.module_name || module.topic || 'module'}-${index}`} className="bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer group">
                        <td className="px-4 py-4 rounded-l-lg">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-sm">play_circle</span>
                            <span className="text-sm font-bold">{module.module_name || module.topic || `Week ${index + 1}`}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs">{module.skill || module.topic || 'General'}</td>
                        <td className="px-4 py-4 text-right rounded-r-lg">
                          <span className="text-[10px] font-bold px-2 py-1 bg-tertiary-container/20 text-tertiary rounded">IN PROGRESS</span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="px-4 py-4 text-xs text-on-surface-variant" colSpan={3}>No learning path yet. Complete an assessment first.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Global Leaderboard */}
          <div className="lg:col-span-4 flex">
            <div className="bg-surface-container-low rounded-lg p-6 w-full">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">emoji_events</span>
                Global Leaderboard
              </h3>
              <div className="space-y-4">
                {leaderboard.length ? leaderboard.slice(0, 5).map((entry: any) => (
                  <div key={`${entry.rank}-${entry.name}`} className={`flex items-center gap-4 p-3 rounded border-l-4 ${entry.name === userName ? 'bg-primary-container/10 border-primary-container' : 'bg-surface-container/30 border-[#FFD700]'}`}>
                    <span className={`text-lg font-black w-4 ${entry.name === userName ? 'text-primary' : ''}`}>{entry.rank}</span>
                    <div className="w-10 h-10 rounded bg-surface-container-high overflow-hidden">
                      <img alt="Leaderboard Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwido4FrOyQDl-Ivu-_zuj02_tAWsydu_3xRfz7MhShCvwB731oElIDT_1kELoCc6UBxTOb0gwof3RA2RO4pGvycoTM6hEinNJHXl8kOTjYjZGpud3OfKen9iNvQFe4hmfCAtzAc2GXF7BDOsFSf6t1dIMwJ5nLZlC0RPp1Nv2UhuBbmJXoVVavcrG-kCDyhLlIDWQcb4BQ9_lrNkpbrmvCYUrUIWewMp0dsTJjY22ivLJAmg2aeIoBOh5Pu-xPjgV2fozKCQlkA" className="" />
                    </div>
                    <div className="flex-grow">
                      <p className={`text-sm font-bold ${entry.name === userName ? 'text-primary' : ''}`}>{entry.name}</p>
                      <p className="text-[10px] text-on-surface-variant">{entry.score} pts</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary-container/20 px-2 py-1 rounded">{entry.badge || 'PRO'}</span>
                  </div>
                )) : <div className="text-xs text-on-surface-variant">Leaderboard will appear after submissions.</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
