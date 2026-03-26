import { useMemo, useState } from 'react';
import Landing from './screens/Landing';
import Login from './screens/Login';
import Register from './screens/Register';
import ProfileBuilder from './screens/ProfileBuilder';
import ExtractionAnalysis from './screens/ExtractionAnalysis';
import ProfileCreated from './screens/ProfileCreated';
import Dashboard from './screens/Dashboard';
import AssessmentIDE from './screens/AssessmentIDE';
import LearningPath from './screens/LearningPath';
import { loadSession } from './lib/session';

export type Screen = 'landing' | 'login' | 'register' | 'profile-builder' | 'extraction-analysis' | 'profile-created' | 'dashboard' | 'assessment-ide' | 'learning-path';

export default function App() {
  const initialScreen = useMemo<Screen>(() => (loadSession()?.user_id ? 'dashboard' : 'landing'), []);
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialScreen);
  const [toast, setToast] = useState<string>('');

  const navigate = (screen: Screen) => setCurrentScreen(screen);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-[#fbf8fc] font-sans antialiased">
      {currentScreen === 'landing' && <Landing onNavigate={navigate} onNotify={notify} />}
      {currentScreen === 'login' && <Login onNavigate={navigate} onNotify={notify} />}
      {currentScreen === 'register' && <Register onNavigate={navigate} onNotify={notify} />}
      {currentScreen === 'profile-builder' && <ProfileBuilder onNavigate={navigate} onNotify={notify} />}
      {currentScreen === 'extraction-analysis' && <ExtractionAnalysis onNavigate={navigate} onNotify={notify} />}
      {currentScreen === 'profile-created' && <ProfileCreated onNavigate={navigate} />}
      {currentScreen === 'dashboard' && <Dashboard onNavigate={navigate} onNotify={notify} />}
      {currentScreen === 'assessment-ide' && <AssessmentIDE onNavigate={navigate} onNotify={notify} />}
      {currentScreen === 'learning-path' && <LearningPath onNavigate={navigate} onNotify={notify} />}

      {toast ? (
        <div className="fixed bottom-5 right-5 z-[80] bg-surface-container-highest border border-outline-variant/40 px-4 py-2 text-xs font-bold tracking-wide text-white shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
