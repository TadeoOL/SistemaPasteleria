import React, { useEffect, useCallback } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../features/auth/store/authStore';

interface PrivateRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

interface DecodedToken {
  exp?: number;
}

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    if (!decodedToken.exp) return true;

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTimeInSeconds;
  } catch {
    return true;
  }
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectTo = '/login', children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  //   const location = useLocation();
  const navigate = useNavigate();

  // const handleTokenExpiration = useCallback(() => {
  //   logout();
  //   toast.error('Tiempo de sesión expirado');
  //   navigate(redirectTo);
  // }, [logout, navigate, redirectTo]);

  // useEffect(() => {
  //   if (token && isTokenExpired(token)) {
  //     handleTokenExpiration();
  //   }
  // }, [token, handleTokenExpiration]);

  // useEffect(() => {
  //   const checkTokenExpiration = () => {
  //     if (token && isTokenExpired(token)) {
  //       handleTokenExpiration();
  //     }
  //   };

  //   const intervalId = setInterval(checkTokenExpiration, 60 * 1000);
  //   return () => clearInterval(intervalId);
  // }, [token, handleTokenExpiration]);

  if (!isAuthenticated) return <Navigate to={redirectTo} />;

  return children ? <>{children}</> : <Outlet />;
};
