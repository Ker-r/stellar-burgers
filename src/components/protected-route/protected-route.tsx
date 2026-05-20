import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { getCookie } from '../../utils/cookie';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();

  const token = getCookie('accessToken');

  if (onlyUnAuth && token) {
    const { from } = (location.state as { from?: { pathname: string } }) || {};
    return <Navigate to={from || '/'} replace />;
  }

  if (!onlyUnAuth && !token) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
