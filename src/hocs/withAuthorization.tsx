import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { UserRole } from '@app/constants/userRole';

interface PrivateRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const user = useAppSelector((state) => state.user.user);
  const userRole = UserRole[user.userType];
  const navigate = useNavigate();

  if (!userRole || !allowedRoles.includes(userRole)) {
    navigate('/404');
    return null;
  }

  return children;
};
