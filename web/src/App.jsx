import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Dashboard />
      <footer className="border-t border-gray-100 mt-16 py-8 text-center">
        <p className="text-xs text-gray-400">
          HealthPulse AI &mdash; Powered by scikit-learn, SHAP, and Framingham Heart Study data.
          For educational purposes only. Not a substitute for medical advice.
        </p>
      </footer>
    </div>
  );
}
