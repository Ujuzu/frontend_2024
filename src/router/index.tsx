import { createBrowserRouter } from 'react-router-dom';

import NotFoundPage from '@/pages/404page';
import ErrorPage from '@/pages/errorPage';
import App from '@/App';

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
    path: '*',
    element: <NotFoundPage />,
  },
]);
