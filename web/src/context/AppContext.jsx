import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('hp_lang') || 'en');
  const [token, setToken] = useState(() => localStorage.getItem('hp_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hp_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => { localStorage.setItem('hp_lang', lang); }, [lang]);
  useEffect(() => {
    if (token) localStorage.setItem('hp_token', token);
    else localStorage.removeItem('hp_token');
  }, [token]);
  useEffect(() => {
    if (user) localStorage.setItem('hp_user', JSON.stringify(user));
    else localStorage.removeItem('hp_user');
  }, [user]);

  function t(path) {
    const keys = path.split('.');
    let val = translations[lang];
    for (const k of keys) {
      val = val?.[k];
    }
    return val || path;
  }

  function login(tokenValue, userData) {
    setToken(tokenValue);
    setUser(userData);
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hp_token');
    localStorage.removeItem('hp_user');
  }

  function toggleLang() {
    setLang(prev => prev === 'en' ? 'vi' : 'en');
  }

  return (
    <AppContext.Provider value={{ lang, toggleLang, t, token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
