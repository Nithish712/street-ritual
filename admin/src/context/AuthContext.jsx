import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(() => !!sessionStorage.getItem('sr_admin_auth'));

  const login = (token) => {
    sessionStorage.setItem('sr_admin_auth', token);
    setIsAuth(true);
  };

  const logout = () => {
    sessionStorage.removeItem('sr_admin_auth');
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
