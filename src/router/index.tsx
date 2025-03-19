import { createBrowserRouter } from 'react-router-dom';

import NotFoundPage from '@/pages/404page';
import ErrorPage from '@/pages/errorPage';
import App from '@/App';
import UserManagement from '@/pages/admin/userManagement';
import { USER_MANAGEMENT_PATH } from '@/data/url.data';
import LayoutWrapper from '@/components/layout/layoutWrapper';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
    ],
  },
  {
    path: '/u',
    element: <LayoutWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: USER_MANAGEMENT_PATH,
        element: <UserManagement />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
