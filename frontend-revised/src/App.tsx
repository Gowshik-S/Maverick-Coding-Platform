import { useState } from 'react';
import Landing from './screens/Landing';
import Login from './screens/Login';
import Register from './screens/Register';
import ProfileBuilder from './screens/ProfileBuilder';
import ExtractionAnalysis from './screens/ExtractionAnalysis';
import ProfileCreated from './screens/ProfileCreated';
import Dashboard from './screens/Dashboard';
import AssessmentIDE from './screens/AssessmentIDE';

export type Screen = 'landing' | 'login' | 'register' | 'profile-builder' | 'extraction-analysis' | 'profile-created' | 'dashboard' | 'assessment-ide';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  return (
    <div className="min-h-screen bg-[#0e0e11] text-[#fbf8fc] font-sans antialiased">
      {currentScreen === 'landing' && <Landing onNavigate={navigate} />}
      {currentScreen === 'login' && <Login onNavigate={navigate} />}
      {currentScreen === 'register' && <Register onNavigate={navigate} />}
      {currentScreen === 'profile-builder' && <ProfileBuilder onNavigate={navigate} />}
      {currentScreen === 'extraction-analysis' && <ExtractionAnalysis onNavigate={navigate} />}
      {currentScreen === 'profile-created' && <ProfileCreated onNavigate={navigate} />}
      {currentScreen === 'dashboard' && <Dashboard onNavigate={navigate} />}
      {currentScreen === 'assessment-ide' && <AssessmentIDE onNavigate={navigate} />}
    </div>
  );
}
