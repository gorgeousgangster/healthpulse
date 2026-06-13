import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';

function AppContent() {
  const { isAuthenticated, t } = useApp();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Dashboard />
      <footer className="border-t border-gray-100 mt-16 py-8 text-center">
        <p className="text-xs text-gray-400">{t('footer')}</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
