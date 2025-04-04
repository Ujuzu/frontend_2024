import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show nothing during loading to prevent flash of unauthorized content
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      {/* Optional loading spinner */}
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
