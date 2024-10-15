import { lazy } from 'react';
import Loadable from '../components/Loadable';
import PublicRoute from '../components/publicRoute/PublicRoute';
import { Navigate } from 'react-router-dom';

export const LoginView = Loadable(lazy(() => import('../features/auth/screens/LoginView')));

const AuthRoutes = {
  path: '/',
  element: <PublicRoute />,
  children: [
    {
      path: 'login',
      element: <LoginView />
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />
    }
  ]
};

export default AuthRoutes;
