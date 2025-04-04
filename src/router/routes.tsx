import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import NotFoundPage from '@/pages/404page';
import UserManagement from '@/pages/admin/userManagement';
import AdminRegister from '@/pages/admin/register';
import AdminLogin from '@/pages/admin/login';
import ForgotPassword from '@/pages/admin/forgotPassword';
import ResetPassword from '@/pages/admin/resetPassword';
import LayoutWrapper from '@/components/layout/layoutWrapper';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/admin/login" replace /> // Default redirect
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/login" replace />
      },
      // Public routes - accessible without authentication
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
      },
      // Protected admin routes - require authentication
      {
        element: <ProtectedRoute />,
        children: [
          // Add your protected admin routes here
          // For example: dashboard, settings, profile, etc.
          // { path: 'dashboard', element: <Dashboard /> },
        ]
      }
    ],
  },
  {
    path: '/u',
    element: <LayoutWrapper />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
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
  }
];
