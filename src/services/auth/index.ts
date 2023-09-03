import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';
export interface SignUpRequest {
  name: string;
  surname: string;
  userName: string;
  emailAddress: string;
  phoneNumber: string;
  password: string;
}

export interface LoginRequest {
  userNameOrEmailAddress: string;
  password: string;
  rememberClient: boolean;
}

export interface ResetPasswordRequest {
  emailAddress: string;
}

export interface SecurityCodePayload {
  code: string;
}

export interface NewPasswordData {
  password: string;
  emailAddress: string;
}

// eslint-disable-next-line
export const login = (loginPayload: LoginRequest): Promise<any> =>
  httpApi.post<any>(`${apiPrefix.auth}/Authenticate`, { ...loginPayload }).then(({ data }) => data);
// eslint-disable-next-line
export const signUp = (signUpData: SignUpRequest): Promise<any> =>
  httpApi.post<any>(`${apiPrefix.auth}/Register`, { ...signUpData }).then(({ data }) => data);
// eslint-disable-next-line
export const resetPassword = (resetPasswordPayload: ResetPasswordRequest): Promise<any> =>
  httpApi.post<any>(`${apiPrefix.auth}/ForgetPassword`, { ...resetPasswordPayload }).then(({ data }) => data);
// eslint-disable-next-line
export const verifySecurityCode = (securityCodePayload: SecurityCodePayload): Promise<undefined> =>
  httpApi
    .post<undefined>(`${apiPrefix.auth}/CheckVerficationCodeForForgetPassword`, { ...securityCodePayload })
    .then(({ data }) => data);
// eslint-disable-next-line
export const setNewPassword = (newPasswordData: NewPasswordData): Promise<undefined> =>
  httpApi.post<undefined>(`${apiPrefix.auth}/SetNewPassword`, { ...newPasswordData }).then(({ data }) => data);
// eslint-disable-next-line
export const getUserInformationWhenLogIn = (): Promise<any> =>
  httpApi.get<any>('/api/services/app/User/GetInformationFromLoginUser');
