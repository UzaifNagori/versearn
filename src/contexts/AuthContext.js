'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, fetchMe, logout as authLogout } from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pehle localStorage se load karo (fast)
    const cached = getUser();
    if (cached) setUser(cached);

    // Phir API se fresh data lao
    fetchMe()
      .then((freshUser) => {
        if (freshUser) setUser(freshUser);
        else setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    authLogout();
    setUser(null);
  };

  // User update karo (profile save ke baad)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
