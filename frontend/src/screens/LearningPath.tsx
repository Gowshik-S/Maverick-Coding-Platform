import React from 'react';
import {
  Bell,
  Settings,
  LayoutDashboard,
  FileQuestion,
  Route,
  Code,
  BarChart3,
  HelpCircle,
  FileText,
  AlertTriangle,
  Archive,
  Clock,
  Flame,
  History,
  Filter,
  Search,
  CheckCircle2,
  MoreHorizontal,
  MoreVertical,
  Network,
  PlayCircle,
  Lock,
  RefreshCw,
  Edit2,
  Sparkles,
  Headset,
} from 'lucide-react';
import type { Screen } from '../App';

type LearningPathProps = {
  onNavigate: (s: Screen) => void;
  onNotify?: (message: string) => void;
};

export default function LearningPath({ onNavigate, onNotify }: LearningPathProps) {
  const comingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    onNotify?.('Coming soon');
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans antialiased selection:bg-[#e6883a] selection:text-[#301400]">
      <header className="fixed top-0 w-full z-50 bg-[#1b1b1c] border-none flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-[#e5e2e1]">Mavericks Coding Platform</span>
          <div className="hidden md:flex items-center gap-6 ml-4">
            <span className="text-[#e6883a] font-bold">My Learning Path</span>
            <span className="text-[#dac2b2] text-sm opacity-60">|</span>
            <span className="text-[#dac2b2] text-sm">
              Goal: <span className="text-[#e5e2e1] font-medium">Full Stack Dev</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#dac2b2] hover:bg-[#2a2d2e] transition-colors rounded-full active:scale-95 duration-200">
            <Bell className="w-6 h-6" />
          </button>
          <button className="p-2 text-[#dac2b2] hover:bg-[#2a2d2e] transition-colors rounded-full active:scale-95 duration-200">
            <Settings className="w-6 h-6" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#353535] overflow-hidden">
            <img
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFIuOWNugEBdoJBZzoheNAemJVGwYpB_nlt2BhJj_GV0cnR4cUQH4_zDMbuPMfPqqMbky8106loF1n-OE2KhBS-TrMF3WzH9eyBwwmVpP9LnIOKCzdegXedqiuYPp5TpqYL7cwY3oHHbx1Eb2ssfFNptpP3YmBMa5EkHfWMQU0GvSQVeCw-7FBpuaQUVbOisR0icdsa4jtTVXnMJEh0QIrKpYU0brt9O2LuL5V9bpoRFxRwrnSzsNqi2SVyrePZmYgZyGevgI2XR8"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-[#202020] border-none flex flex-col pt-20 pb-6 px-4">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-black text-[#e5e2e1]">Mavericks</h1>
          <p className="text-xs text-[#dac2b2] uppercase tracking-widest font-bold">Coding Platform</p>
        </div>
        <nav className="flex-1 space-y-1">
          <a onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }} href="#" className="flex items-center gap-3 px-3 py-2.5 text-[#dac2b2] hover:bg-[#2a2d2e] transition-all duration-150 ease-in-out rounded-lg group">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('assessment-ide'); }} href="#" className="flex items-center gap-3 px-3 py-2.5 text-[#dac2b2] hover:bg-[#2a2d2e] transition-all duration-150 ease-in-out rounded-lg group">
            <FileQuestion className="w-5 h-5" />
            <span className="text-sm font-medium">Assessments</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-[#37373d] text-[#e6883a] border-r-2 border-[#e6883a] transition-all duration-150 ease-in-out rounded-lg group">
            <Route className="w-5 h-5" />
            <span className="text-sm font-medium">Learning Path</span>
          </a>
          <a onClick={comingSoon} href="#" className="flex items-center gap-3 px-3 py-2.5 text-[#dac2b2] hover:bg-[#2a2d2e] transition-all duration-150 ease-in-out rounded-lg group">
            <Code className="w-5 h-5" />
            <span className="text-sm font-medium">Hackathons</span>
          </a>
          <a onClick={comingSoon} href="#" className="flex items-center gap-3 px-3 py-2.5 text-[#dac2b2] hover:bg-[#2a2d2e] transition-all duration-150 ease-in-out rounded-lg group">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">Leaderboard</span>
          </a>
        </nav>
        <div className="mt-auto space-y-1 pt-4 border-t border-[#353535]">
          <a onClick={comingSoon} href="#" className="flex items-center gap-3 px-3 py-2 text-[#dac2b2] hover:bg-[#2a2d2e] transition-all duration-150 rounded-lg">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Support</span>
          </a>
          <a onClick={comingSoon} href="#" className="flex items-center gap-3 px-3 py-2 text-[#dac2b2] hover:bg-[#2a2d2e] transition-all duration-150 rounded-lg">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Documentation</span>
          </a>
        </div>
      </aside>

      <main className="pl-64 pt-16 min-h-screen bg-[#131313]">
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
          <div className="bg-[#1b1b1c] p-5 flex items-center justify-between border-l-4 border-[#e6883a]">
            <div className="flex items-center gap-4">
              <div className="bg-[#e6883a]/10 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-[#e6883a]" />
              </div>
              <div>
                <h3 className="text-[#e5e2e1] font-bold text-lg">No activity for 4 days</h3>
                <p className="text-[#dac2b2] text-sm">You're falling behind your Full Stack Dev goal. Ready to pick up where you left off?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-[#544338] text-[#e5e2e1] text-sm font-medium rounded hover:bg-[#2a2a2a] transition-colors">
                Dismiss
              </button>
              <button className="px-4 py-2 bg-[#3a95e8] text-[#001d36] font-bold text-sm rounded hover:opacity-90 transition-opacity">
                Take Assessment
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1b1b1c] p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#dac2b2] text-sm font-medium">Modules Completed</span>
                <Archive className="w-5 h-5 text-[#e6883a]" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-[#e5e2e1]">12/20</span>
                <span className="text-sm text-[#61dac1] mb-1 font-bold">+2 this week</span>
              </div>
              <div className="w-full bg-[#353535] h-1.5 mt-4 rounded-full overflow-hidden">
                <div className="bg-[#e6883a] h-full w-[60%]"></div>
              </div>
            </div>

            <div className="bg-[#1b1b1c] p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#dac2b2] text-sm font-medium">Hours Spent</span>
                <Clock className="w-5 h-5 text-[#3a95e8]" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-[#e5e2e1]">45 hrs</span>
                <span className="text-sm text-[#dac2b2] mb-1 font-medium">Avg 6h/week</span>
              </div>
            </div>

            <div className="bg-[#1b1b1c] p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#dac2b2] text-sm font-medium">Current Streak</span>
                <Flame className="w-5 h-5 text-[#ffb4ab]" fill="currentColor" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-[#e5e2e1]">5 days</span>
                <span className="text-sm text-[#ffb4ab] mb-1 font-bold">Needs activity</span>
              </div>
            </div>

            <div className="bg-[#1b1b1c] p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#dac2b2] text-sm font-medium">Last Activity</span>
                <History className="w-5 h-5 text-[#61dac1]" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-[#e5e2e1]">2 hours ago</span>
                <span className="text-sm text-[#dac2b2] mb-1">React Props</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#e5e2e1]">8-Week Accelerated Path</h2>
              <div className="flex gap-2">
                <button className="p-2 text-[#dac2b2] hover:bg-[#2a2a2a] rounded">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="p-2 text-[#dac2b2] hover:bg-[#2a2a2a] rounded">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-[#1b1b1c] rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#202020] border-b border-[#353535]">
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Week</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Module</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Skill</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Est. Hours</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#353535]">
                  <tr className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#dac2b2]">01</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#e5e2e1]">Python Fundamentals</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">Python 3.x</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">10h</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#61dac1]/10 text-[#61dac1] rounded uppercase">Beginner</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#353535] h-1 rounded-full">
                          <div className="bg-[#61dac1] h-full w-full"></div>
                        </div>
                        <span className="text-xs text-[#dac2b2]">100%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#61dac1] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" fill="currentColor" stroke="#1b1b1c" /> Done
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 border border-[#544338] text-[11px] font-bold rounded hover:bg-[#2a2a2a]">Review</button>
                    </td>
                  </tr>

                  <tr className="bg-[#2a2a2a]">
                    <td className="px-6 py-4 text-sm font-medium text-[#dac2b2]">02</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#e6883a]">Advanced DSA</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">Algorithms</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">15h</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#ffb4ab]/10 text-[#ffb4ab] rounded uppercase">Advanced</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#353535] h-1 rounded-full">
                          <div className="bg-[#e6883a] h-full w-[45%]"></div>
                        </div>
                        <span className="text-xs text-[#dac2b2]">45%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#e6883a] flex items-center gap-1">
                        <MoreHorizontal className="w-4 h-4" /> In Progress
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="px-3 py-1 bg-[#e6883a] text-[#301400] text-[11px] font-bold rounded">Continue</button>
                      <button className="p-1 border border-[#544338] rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>

                  <tr className="bg-[#2a2a2a]/50">
                    <td colSpan={8} className="px-6 py-6">
                      <div className="grid grid-cols-3 gap-8">
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-[#dac2b2] uppercase tracking-widest">Why this module?</h4>
                          <p className="text-sm text-[#e5e2e1] leading-relaxed">
                            Understanding Big O complexity and Graph Theory is critical for passing technical interviews at Tier-1 tech firms and optimizing platform performance.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-[#dac2b2] uppercase tracking-widest">Your Project</h4>
                          <div className="flex items-center gap-3 p-3 bg-[#202020] rounded border border-[#544338]/30">
                            <Network className="w-6 h-6 text-[#3a95e8]" />
                            <div>
                              <p className="text-sm font-bold text-[#e5e2e1]">Pathfinding Visualizer</p>
                              <p className="text-xs text-[#dac2b2]">Implement Dijkstra's & A*</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-[#dac2b2] uppercase tracking-widest">Resources</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-[#3a95e8] hover:underline cursor-pointer">
                              <PlayCircle className="w-4 h-4" /> Master Graph Algorithms (Video)
                            </li>
                            <li className="flex items-center gap-2 text-sm text-[#3a95e8] hover:underline cursor-pointer">
                              <FileText className="w-4 h-4" /> Understanding Time Complexity (Article)
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-3 pt-4 border-t border-[#353535]/50">
                        <button className="px-3 py-1.5 border border-[#544338] text-[11px] font-bold rounded hover:bg-[#353535]">Mark Done</button>
                        <button className="px-3 py-1.5 border border-[#544338] text-[11px] font-bold rounded hover:bg-[#353535]">Skip</button>
                        <button className="px-3 py-1.5 border border-[#544338] text-[11px] font-bold rounded hover:bg-[#353535] text-[#ffb4ab]">Replace</button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#2a2a2a] transition-colors opacity-70">
                    <td className="px-6 py-4 text-sm font-medium text-[#dac2b2]">03</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#e5e2e1]">Database Architectures</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">SQL & NoSQL</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">12h</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#3a95e8]/10 text-[#3a95e8] rounded uppercase">Intermediate</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#353535] h-1 rounded-full"></div>
                        <span className="text-xs text-[#dac2b2]">0%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#dac2b2] flex items-center gap-1">
                        <Lock className="w-4 h-4" /> Locked
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 border border-[#544338] text-[11px] font-bold rounded cursor-not-allowed">Start</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#e5e2e1]">Target Skill Analysis</h2>
            <div className="bg-[#1b1b1c] rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#202020] border-b border-[#353535]">
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Skill</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Your Score</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Target</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Gap</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#dac2b2] uppercase tracking-wider text-right">In Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#353535]">
                  <tr className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[#e5e2e1]">Python</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">88%</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">90%</td>
                    <td className="px-6 py-4 text-sm text-[#61dac1] font-bold">-2%</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#61dac1]/10 text-[#61dac1] text-[10px] font-black rounded uppercase">On Track</span>
                    </td>
                    <td className="px-6 py-4 text-right text-[#61dac1]">
                      <CheckCircle2 className="w-5 h-5 ml-auto" fill="currentColor" stroke="#1b1b1c" />
                    </td>
                  </tr>
                  <tr className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[#e5e2e1]">Data Structures</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">42%</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">85%</td>
                    <td className="px-6 py-4 text-sm text-[#ffb4ab] font-bold">-43%</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#ffb4ab]/10 text-[#ffb4ab] text-[10px] font-black rounded uppercase">Needs Work</span>
                    </td>
                    <td className="px-6 py-4 text-right text-[#61dac1]">
                      <CheckCircle2 className="w-5 h-5 ml-auto" fill="currentColor" stroke="#1b1b1c" />
                    </td>
                  </tr>
                  <tr className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[#e5e2e1]">React & Redux</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">15%</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">80%</td>
                    <td className="px-6 py-4 text-sm text-[#ffb4ab] font-bold">-65%</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#ffb4ab]/10 text-[#ffb4ab] text-[10px] font-black rounded uppercase">Needs Work</span>
                    </td>
                    <td className="px-6 py-4 text-right text-[#61dac1]">
                      <CheckCircle2 className="w-5 h-5 ml-auto" fill="currentColor" stroke="#1b1b1c" />
                    </td>
                  </tr>
                  <tr className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[#e5e2e1]">SQL Optimization</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">72%</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2]">75%</td>
                    <td className="px-6 py-4 text-sm text-[#dac2b2] font-bold">-3%</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#61dac1]/10 text-[#61dac1] text-[10px] font-black rounded uppercase">On Track</span>
                    </td>
                    <td className="px-6 py-4 text-right text-[#61dac1]">
                      <CheckCircle2 className="w-5 h-5 ml-auto" fill="currentColor" stroke="#1b1b1c" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#353535]">
            <button className="px-6 py-3 bg-[#353535] border border-[#544338]/30 text-[#e5e2e1] font-bold rounded-lg flex items-center gap-2 hover:bg-[#393939] transition-colors">
              <RefreshCw className="w-5 h-5" />
              Re-assess Me
            </button>
            <button className="px-6 py-3 bg-[#353535] border border-[#544338]/30 text-[#e5e2e1] font-bold rounded-lg flex items-center gap-2 hover:bg-[#393939] transition-colors">
              <Edit2 className="w-5 h-5" />
              Update My Goal
            </button>
            <button className="px-6 py-3 bg-[#e6883a] text-[#301400] font-black rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Sparkles className="w-5 h-5" />
              Regenerate Path
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <button className="w-14 h-14 bg-[#3a95e8] text-[#001d36] rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform">
          <Headset className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
