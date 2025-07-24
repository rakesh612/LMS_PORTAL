import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, logoutUser } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { success, user } = await getCurrentUser();
        setUser(success ? user : null);
      } catch (error) {
        console.error('Auth check error:', error?.message ?? error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    if (!initialCheckDone) {
      checkAuth();
    }
  }, [initialCheckDone]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error?.message ?? error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, initialCheckDone, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);