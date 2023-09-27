import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { doLogin } from '@app/store/slices/authSlice';
import { LoginRequest } from '@app/services/auth';
import { Link } from 'react-router-dom';
import { useAccessTokenCookie } from '@app/services/cookies';

const initValues: LoginRequest = {
  userNameOrEmailAddress: '',
  password: '',
  rememberClient: false,
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const { persistToken, readToken, deleteToken } = useAccessTokenCookie();

  const handleSubmit = async (values: LoginRequest) => {
    setLoading(true);

    try {
      // Perform the login request here and get the access token
      const response = await dispatch(doLogin(values)); // Replace with your actual login function
      console.log(response.payload);

      // Assuming the login request was successful and you received an access token
      // const accessToken = response.accessToken;

      // Use the persistToken function from the custom hook to store the access token in a cookie
      // persistToken(accessToken);

      // Dispatch the action to update the user state or perform any other necessary tasks
      // dispatch(setUser(response.result));

      // Navigate to the desired page (e.g., the dashboard) after successful login
      navigate('/');
    } catch (error: any) {
      // Handle login failure and display an error message
      notificationController.error({
        message: t('common.error'),
        description: error.message || error.error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = (values: LoginRequest) => {
  //   setLoading(true);

  //   dispatch(doLogin(values))
  //     .unwrap()
  //     .then(() => {
  //       navigate('/');
  //     })
  //     .catch((error) => {
  //       notificationController.error({
  //         message: t('common.error'),
  //         description: error.message || error.error?.message,
  //       });
  //       setLoading(false);
  //     });
  // };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <Auth.FormTitle>{t('auth.logIn')}</Auth.FormTitle>
        <S.LoginDescription>
          <Trans i18nKey={'auth.loginInfo'} />
        </S.LoginDescription>

        <Auth.FormItem
          name="userNameOrEmailAddress"
          label={t('auth.email')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('auth.userNameorEmail')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('auth.password')}
          name="password"
          rules={[
            {
              required: true,
              message: t('common.requiredField'),
            },
          ]}
        >
          <Auth.FormInputPassword placeholder={t('auth.password')} />
        </Auth.FormItem>

        <Auth.ActionsWrapper>
          <BaseForm.Item name="rememberClient" valuePropName="checked" noStyle>
            <Auth.FormCheckbox>
              <S.RememberMeText>{t('auth.rememberMe')}</S.RememberMeText>
            </Auth.FormCheckbox>
          </BaseForm.Item>

          <Link to="/auth/forgot-password">
            <S.ForgotPasswordText>{t('auth.forgotPassword')}</S.ForgotPasswordText>
          </Link>
        </Auth.ActionsWrapper>

        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('auth.logIn')}
          </Auth.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
