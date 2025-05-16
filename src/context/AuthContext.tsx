import { IAuthContextType, ILoginToken, IUser } from '@/Interfaces/IUserLoginInterfaces';
import { emptyLocalStorage, getLocalstorage, setLocalStorage } from '@/utils/localStorageHelper';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate(); // Now this will work since we're inside Router context
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<ILoginToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getLocalstorage<ILoginToken>('token');
        const storedUser = getLocalstorage<IUser>('user');
        // const storedUser = getLocalstorage<IUser>('user');

        
        if (token && storedUser) {
          // Optionally validate token with backend here
          
          setToken(token);
          const parsedUser = typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser;
setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth validation failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsInitializing(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (token: ILoginToken, userData: IUser) => {
    setIsLoading(true);
    
    try {
      setLocalStorage<ILoginToken>('token', token);
      setLocalStorage<IUser>('user', userData);
      
      setUser(userData);
      setToken(token);
      setIsAuthenticated(true);
      
      // Redirect to saved URL or default
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/u/';
      sessionStorage.removeItem('redirectUrl');
      navigate(redirectUrl);
      
      await new Promise(resolve => setTimeout(resolve, 300)); // Optional delay
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    emptyLocalStorage();
    
    setIsAuthenticated(false);
    setUser(null);

    navigate('/u/logout', { 
            replace: true,
            state: { noBack: true }
    });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    login,
    token,
    logout,
    setUser,
    setIsLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): IAuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
