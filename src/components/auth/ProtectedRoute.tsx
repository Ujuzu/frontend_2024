import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const API_URL = (import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337').replace(/\/$/, '');
  
  useEffect(() => {
    // Check authentication state once per session
    const checkAuth = async () => {
      // Check if we already validated the token in this session
      const isAuthenticated = sessionStorage.getItem('isAuthenticated');
      
      if (isAuthenticated === 'true') {
        setStatus('authenticated');
        return;
      }
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setStatus('unauthenticated');
        return;
      }
      
      try {
        await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Store authentication state in session storage
        sessionStorage.setItem('isAuthenticated', 'true');
        setStatus('authenticated');
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isAuthenticated');
        setStatus('unauthenticated');
      }
    };
    
    checkAuth();
  }, [API_URL]);
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-[#000b17]">
        <Loader2 className="h-16 w-16 text-[#AC19AD] animate-spin" />
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
