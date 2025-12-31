import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <div>Загрузка...</div>;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
