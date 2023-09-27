import { useCookies } from 'react-cookie';

export function useAccessTokenCookie() {
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);

  const persistToken = (token: string) => {
    setCookie('accessToken', token, { path: '/' });
  };

  const readToken = () => {
    return cookies.accessToken || 'bearerToken';
  };

  const deleteToken = () => {
    removeCookie('accessToken', { path: '/' });
  };

  return { persistToken, readToken, deleteToken };
}
