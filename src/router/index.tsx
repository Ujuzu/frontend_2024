import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotFoundPage from '@/pages/404page';
import ErrorPage from '@/pages/errorPage';
import App from '@/App';
import UserManagement from '@/pages/admin/userManagement';
import AdminRegister from '@/pages/admin/register';
import AdminLogin from '@/pages/admin/login';
import ForgotPassword from '@/pages/admin/forgotPassword';
import ResetPassword from '@/pages/admin/resetPassword';
import LayoutWrapper from '@/components/layout/layoutWrapper';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const RootRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/u/" replace /> : <Navigate to="/admin/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RootRedirect /> 
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RootRedirect /> 
      },
      {
        path: 'register',
        element: <AdminRegister />,
      },
      {
        path: 'login',
        element: <AdminLogin />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password/:token',
        element: <ResetPassword />,
      }
    ],
  },
  {
    path: '/u',
    element: <LayoutWrapper />,
    errorElement: <ErrorPage />,
    children: [
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true, // Make the root path render user management
            element: <UserManagement />,
          },
          {
            path: 'user-management',
            element: <UserManagement />,
          }
        ]
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
