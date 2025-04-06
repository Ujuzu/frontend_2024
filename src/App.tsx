import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Loader } from 'lucide-react';

type LoadingState = 'visible' | 'fading' | 'hidden';

const LoadingSpinner = ({ state }: { state: LoadingState }) => (
  <div className={`
    fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm
    ${state === 'visible' ? 'opacity-100' : ''}
    ${state === 'fading' ? 'opacity-0 transition-opacity duration-300 ease-out' : ''}
    ${state === 'hidden' ? 'hidden' : ''}
  `}>
    <div className="flex flex-col items-center gap-2">
      <Loader className="h-12 w-12 animate-spin text-[#AC19AD]" />
    </div>
  </div>
);

const PUBLIC_ROUTES = [
  '/admin/login',
  '/admin/register',
  '/admin/forgot-password',
  '/admin/reset-password',
];

function App() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();
  const [loadingState, setLoadingState] = React.useState<LoadingState>('visible');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingState('fading');
      setTimeout(() => setLoadingState('hidden'), 300);
    }, 1000); // Minimum 1 second display time

    return () => clearTimeout(timer);
  }, []);

  // Show spinner during initialization or while loading
  if (isInitializing || loadingState !== 'hidden') {
    return <LoadingSpinner state={loadingState} />;
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      location.pathname === route ||
      location.pathname.startsWith('/admin/reset-password/')
  );

  if (!isAuthenticated && !isPublicRoute) {
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/admin/login" replace />;
  }

  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/u/" replace />;
  }

  return <Outlet />;
}

export default App;
