import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { WithChildrenProps } from '@app/types/generalTypes';

// Function to calculate the expiration date based on expireInSeconds
function calculateExpirationDate(expireInSeconds: any) {
  const currentDate = new Date();
  return new Date(currentDate.getTime() + expireInSeconds * 1000);
}

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  const expireInSeconds = 86400; // Token expiration time in seconds
  const expirationDate = calculateExpirationDate(expireInSeconds);

  const isTokenExpired = () => {
    const currentDate = new Date();
    // console.log('currentDate', currentDate, 'expirationDate', expirationDate, 'kk', currentDate > expirationDate);
    return currentDate > expirationDate;
  };

  if (token === 'bearerToken' || isTokenExpired()) {
    return <Navigate to="/auth/login" replace />;
  }

  // console.log('token', token);

  return <>{children}</>;
};

export default RequireAuth;
