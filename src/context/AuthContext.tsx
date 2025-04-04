// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = (import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337').replace(/\/$/, '');

  // Check auth status
  const checkAuth = async () => {
    setIsLoading(true);
    setShowLoader(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      setShowLoader(false);
      if (location.pathname.startsWith('/u/')) {
        navigate('/admin/login', { replace: true });
      }
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      if (location.pathname.startsWith('/u/')) {
        navigate('/admin/', { replace: true });
      }
    } finally {
      setIsLoading(false);
      setShowLoader(false);
    }
  };
  
  // Login function
  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    navigate('/u/', { replace: true });
  };
  
  // Logout function (now without delay)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    window.location.replace('/admin/login');
  };
  
  // Check auth on mount and location changes
  useEffect(() => {
    checkAuth();
    
    // Prevent back button after logout
    const handlePopState = () => {
      if (!isAuthenticated && location.pathname.startsWith('/u/')) {
        navigate('/admin/', { replace: true });
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname]);
  
  // Global loading screen
  if ((isLoading || showLoader) && location.pathname.startsWith('/u/')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-16 w-16 text-[#AC19AD] animate-spin" />
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
