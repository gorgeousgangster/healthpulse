import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar({ history, onSelectRecord }) {
  const { t, lang, toggleLang, isAuthenticated, user, logout } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{t('nav.title')}</h1>
            <p className="text-xs text-gray-400 leading-tight">{t('nav.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 transition-colors border border-gray-200"
          >
            <span className={lang === 'en' ? 'font-bold text-blue-600' : ''}>EN</span>
            <span className="text-gray-300">|</span>
            <span className={lang === 'vi' ? 'font-bold text-blue-600' : ''}>VN</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            {t('nav.live')}
          </span>

          {isAuthenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-full transition-colors border border-gray-200"
              >
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">
                    {(user?.name || user?.email || '?')[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-700 hidden sm:inline">{user?.name || user?.email}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {history && history.length > 0 && (
                    <div className="p-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 px-3 py-1.5 uppercase tracking-wide">{t('history.title')}</p>
                      <div className="max-h-48 overflow-y-auto space-y-0.5">
                        {history.map(record => (
                          <button
                            key={record.id}
                            onClick={() => { onSelectRecord(record); setDropdownOpen(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-700">{formatDate(record.created_at)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                              record.risk_level === 'low' ? 'bg-emerald-100 text-emerald-700' :
                              record.risk_level === 'moderate' ? 'bg-amber-100 text-amber-700' :
                              record.risk_level === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {record.risk_level}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {(!history || history.length === 0) && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">{t('history.noHistory')}</p>
                    </div>
                  )}
                  <div className="p-2">
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium text-red-600"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
