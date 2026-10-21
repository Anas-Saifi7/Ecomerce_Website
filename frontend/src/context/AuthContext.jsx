import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { STORAGE_KEYS } from '../components/config/storageKeys.js';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readStoredToken() {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || '';
  } catch {
    return '';
  }
}

function persistSession(token, user) {
  if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  else localStorage.removeItem(STORAGE_KEYS.TOKEN);

  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEYS.USER);

  // Legacy key used by older pages
  if (user) localStorage.setItem('Halla_user', JSON.stringify(user));
  else localStorage.removeItem('Halla_user');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => readStoredToken());
  const [loading, setLoading] = useState(true);

  const applyAuth = useCallback((nextToken, nextUser) => {
    setToken(nextToken || '');
    setUser(nextUser || null);
    persistSession(nextToken, nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = readStoredToken();
    if (!currentToken) {
      setUser(null);
      setToken('');
      return null;
    }

    try {
      const data = await authService.getMe();
      const nextUser = data.user;
      applyAuth(currentToken, nextUser);
      return nextUser;
    } catch {
      applyAuth('', null);
      return null;
    }
  }, [applyAuth]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const existing = readStoredToken();
      if (!existing) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        if (!cancelled) {
          applyAuth(existing, data.user);
        }
      } catch {
        if (!cancelled) applyAuth('', null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyAuth]);

  const login = useCallback(
    async (email, password) => {
      const data = await authService.login({ email, password });
      applyAuth(data.token, data.user);
      return data;
    },
    [applyAuth]
  );

  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload);
      applyAuth(data.token, data.user);
      return data;
    },
    [applyAuth]
  );

  const adminLogin = useCallback(
    async (email, password) => {
      const data = await authService.adminLogin({ email, password });
      applyAuth(data.token, data.user);
      if (data.token) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
      }
      return data;
    },
    [applyAuth]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    applyAuth('', null);
  }, [applyAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      isAdmin: Boolean(user && ['admin', 'manager'].includes(user.role)),
      login,
      register,
      logout,
      refreshUser,
      adminLogin,
    }),
    [user, token, loading, login, register, logout, refreshUser, adminLogin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export default AuthContext;
