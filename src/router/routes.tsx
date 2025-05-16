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
import PlatformMonitoring from '@/pages/admin/platformMonitoring';
import ContentManagement from '@/pages/admin/contentManagement';
import SubcriptionManagement from '@/pages/admin/subscriptionManagement';
import LogoutPage from '@/pages/LogoutPage'; // Import the LogoutPage component
import CoursesIndex from '@/pages/courses/Index';

export const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/u/platform-monitoring" replace /> 
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/login" replace />
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
      },
      {
        path: 'logout',
        element: <LogoutPage />, // Add the logout route
      },
    ],
  },
  {
    path: '/u',
    element: <LayoutWrapper />,
    children: [
      {
        index: true,
        element: <Navigate to="/u/platform-monitoring" replace />
      },
      {
        path: 'user-management',
        element: <UserManagement />,
      },
      {
        path: 'platform-monitoring',
        element: <PlatformMonitoring />,
      },
      {
        path: 'p',
        element: <Navigate to="/u/platform-monitoring" replace />
      },
      {
        path:'content-management',
        element: <ContentManagement />,
      },
            {
        path:'courses',
        element: <CoursesIndex />,
      },
      {
        path:'subscription-management',
        element: <SubcriptionManagement />,
      },
      {
        path: 'logout',
        element: <LogoutPage />, // Add the logout route here as well
      }
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  }
];
