import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { t, lang, toggleLang, isAuthenticated, user, logout } = useApp();

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
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 transition-colors border border-gray-200"
          >
            <span className={lang === 'en' ? 'font-bold text-blue-600' : ''}>EN</span>
            <span className="text-gray-300">|</span>
            <span className={lang === 'vi' ? 'font-bold text-blue-600' : ''}>VN</span>
          </button>

          {/* Status */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            {t('nav.live')}
          </span>

          {/* Auth */}
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">{user?.name || user?.email}</span>
              <button onClick={logout} className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-full transition-colors">
                {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
