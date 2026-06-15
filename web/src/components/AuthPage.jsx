import { useState } from 'react';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const API_BASE = 'https://healthpulse-production-b94f.up.railway.app';

export default function AuthPage() {
  const { t, login } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const payload = mode === 'login'
        ? { email: form.email.trim(), password: form.password.trim() }
        : { email: form.email.trim(), password: form.password.trim(), name: form.name.trim() };

      const res = await axios.post(`${API_BASE}${endpoint}`, payload);
      const { access_token } = res.data;

      const meRes = await axios.get(`${API_BASE}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      login(access_token, meRes.data);
    } catch (err) {
      console.error("Frontend Auth Error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || t('auth.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          {mode === 'register' && (
            <div>
              <label className="label">{t('auth.name')}</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                className="input-field" placeholder="John Doe" required
              />
            </div>
          )}
          <div>
            <label className="label">{t('auth.email')}</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              className="input-field" placeholder="you@example.com" required
            />
          </div>
          <div>
            <label className="label">{t('auth.password')}</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              className="input-field" placeholder="••••••••" required minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            {mode === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')}
          </button>

          <p className="text-sm text-center text-gray-500 pt-2">
            {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-blue-600 font-medium hover:underline">
              {mode === 'login' ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
