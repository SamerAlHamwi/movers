import { UserModel } from '@app/interfaces/interfaces';

interface userModel extends UserModel {
  userId: number;
}

export const persistToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const readToken = (): string => {
  return localStorage.getItem('accessToken') || 'bearerToken';
};

export const persistUser = (user: userModel) => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      userId: user.userId,
      userType: user.userType,
    }),
  );
};

export const readUser = (): any => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : '';
};

export const deleteToken = (): void => localStorage.removeItem('accessToken');

export const deleteUser = (): void => {
  localStorage.removeItem('user');
};
