import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

export interface LoginRequest {
  userNameOrEmailAddress: string;
  password: string;
  rememberClient: boolean;
}

// eslint-disable-next-line
export const login = (loginPayload: LoginRequest): Promise<any> =>
  httpApi.post<any>(`${apiPrefix.auth}/Authenticate`, { ...loginPayload }).then(({ data }) => data);
// eslint-disable-next-line
export const getUserInformationWhenLogIn = (): Promise<any> =>
  httpApi.get<any>('/api/services/app/User/GetInformationFromLoginUser');
