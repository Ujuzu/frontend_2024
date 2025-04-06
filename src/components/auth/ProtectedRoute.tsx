import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  
  // Show loading state while authentication is being checked
  if (isInitializing) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Render the protected content only when authenticated
  return <Outlet />;
};

export default ProtectedRoute;
