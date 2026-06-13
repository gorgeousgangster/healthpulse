import { useState } from 'react';
import HealthForm from './HealthForm';
import RiskResults from './RiskResults';
import ErrorState from './ErrorState';
import { predictRisk } from '../api/client';

export default function Dashboard() {
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);

  async function handleAssess(payload) {
    setState('loading');
    setError(null);
    setLastPayload(payload);

    try {
      const data = await predictRisk(payload);
      setResults(data);
      setState('success');
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Failed to connect to the health analysis service.';
      setError(message);
      setState('error');
    }
  }

  function handleRetry() {
    if (lastPayload) handleAssess(lastPayload);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health Risk Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Get an AI-powered assessment of your cardiovascular, diabetes, and mental health risk
          with personalized SHAP explanations.
        </p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="heart" label="Risk Dimensions" value="3" />
        <StatCard icon="brain" label="ML Features" value="13" />
        <StatCard icon="chart" label="Training Data" value="20K+" />
        <StatCard icon="shield" label="Explainability" value="SHAP" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-3">
          <HealthForm onSubmit={handleAssess} isLoading={state === 'loading'} />
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2">
          {state === 'idle' && <IdleState />}
          {state === 'loading' && <LoadingState />}
          {state === 'error' && <ErrorState message={error} onRetry={handleRetry} />}
          {state === 'success' && <RiskResults data={results} />}
        </div>
      </div>
    </div>
  );
}

function IdleState() {
  return (
    <div className="card border-dashed border-2 border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Ready for Assessment</h3>
      <p className="text-xs text-gray-400 max-w-48">Fill in your health profile and click "Assess My Risk" to get started</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="card flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Analyzing Your Profile</h3>
      <p className="text-xs text-gray-400">Running ML model & SHAP explainability...</p>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  const icons = {
    heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    brain: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  };

  return (
    <div className="card flex items-center gap-3 p-4">
      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icons[icon]}
        </svg>
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
}
