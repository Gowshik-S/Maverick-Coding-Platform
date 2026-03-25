import { Link } from 'react-router-dom';
import {
  Home,
  Code2,
  BookOpen,
  Trophy,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Activity,
  Clock,
  Target,
  Zap,
  Terminal,
  ArrowRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { getLeaderboard, getLearningPath, getUser } from '../lib/api';
import { clearSession, loadSession } from '../lib/session';

export default function Dashboard() {
  const session = loadSession();
  const [userName, setUserName] = useState(session?.name ?? 'Developer');
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.user_id) return;

    (async () => {
      const [user, path, board] = await Promise.all([
        getUser(session.user_id),
        getLearningPath(session.user_id),
        getLeaderboard(),
      ]);

      if (user?.name) setUserName(user.name);
      if (Array.isArray(path?.learning_path)) setLearningPath(path.learning_path);
      if (Array.isArray(board)) setLeaderboard(board);
    })();
  }, [session?.user_id]);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <aside className="w-64 bg-surface-container border-r border-outline-variant/10 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-on-background">Maverick</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-container/10 text-primary-container font-medium transition-colors">
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
            <Code2 className="w-5 h-5" />
            Assessments
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
            <BookOpen className="w-5 h-5" />
            Learning Path
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </Link>
        </nav>

        <div className="p-4 border-t border-outline-variant/10 space-y-1">
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={() => {
              clearSession();
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error/10 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-surface flex items-center justify-between px-8 border-b border-outline-variant/10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search modules, challenges, or docs..."
                className="w-full bg-surface-container-high border-none text-sm text-on-surface placeholder-on-surface-variant/50 pl-10 pr-4 py-2 rounded-full focus:ring-1 focus:ring-outline transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button aria-label="Notifications" title="Notifications" className="relative text-on-surface-variant hover:text-on-surface transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-on-surface">{userName}</p>
                <p className="text-xs text-on-surface-variant">Active User</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold">
                {userName.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-on-background tracking-tight">Welcome back, {userName}.</h1>
                <p className="text-on-surface-variant mt-1">Live progress from your backend profile and learning path.</p>
              </div>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary-container/10">
                Resume Path
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Skill Score</span>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-on-surface">{leaderboard.find((x) => x.name === userName)?.score ?? 0}</span>
                  <span className="text-xs text-secondary font-bold">current</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Modules</span>
                  <BookOpen className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-on-surface">{learningPath.length}</span>
                  <span className="text-xs text-on-surface-variant">weeks</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Time Spent</span>
                  <Clock className="w-5 h-5 text-tertiary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-on-surface">--</span>
                  <span className="text-xs text-on-surface-variant">tracked soon</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Current Streak</span>
                  <Zap className="w-5 h-5 text-error" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-on-surface">--</span>
                  <span className="text-xs text-on-surface-variant">tracked soon</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-container-low rounded-3xl border border-outline-variant/10 overflow-hidden flex flex-col">
                <div className="p-8 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-container/20 text-primary-container text-xs font-bold rounded-full uppercase tracking-wider">In Progress</span>
                    <span className="text-xs text-on-surface-variant font-mono">Week 1 recommendation</span>
                  </div>
                  <h2 className="text-2xl font-bold text-on-surface mb-2">
                    {learningPath[0]?.topic ?? 'Run assessment to generate your plan'}
                  </h2>
                  <p className="text-on-surface-variant mb-8 max-w-xl leading-relaxed">
                    {learningPath[0]?.why ?? 'Learning path data is fetched from /api/learning-path/{user_id}.'}
                  </p>

                  <button className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-surface-bright transition-all">
                    Continue Learning
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-2 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
              </div>

              <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-error" />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">Leaderboard</h3>
                </div>

                <div className="space-y-2">
                  {leaderboard.length ? leaderboard.slice(0, 5).map((item) => (
                    <div key={`${item.rank}-${item.name}`} className="flex items-center justify-between text-sm py-2 border-b border-outline-variant/10">
                      <span>#{item.rank} {item.name}</span>
                      <span className="font-bold">{item.score}</span>
                    </div>
                  )) : <p className="text-sm text-on-surface-variant">No entries yet.</p>}
                </div>
              </div>

              <div className="lg:col-span-3 bg-surface-container-low rounded-3xl border border-outline-variant/10 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-on-surface">Learning Path</h3>
                  <button className="text-sm font-medium text-primary-container hover:underline">Live Data</button>
                </div>

                <div className="space-y-4">
                  {learningPath.length ? learningPath.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface">Week {item.week}: {item.topic}</h4>
                          <span className="text-xs text-on-surface-variant">{item.why}</span>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-on-surface-variant">{item.skill_area}</div>
                    </div>
                  )) : (
                    <div className="p-4 rounded-xl border border-outline-variant/10 text-on-surface-variant text-sm">
                      Learning path will appear after your first assessment.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
