import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doSignUp } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { SignUpRequest } from '@app/services/auth';
import { FormTitle } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import styled from 'styled-components';
import CustomPasswordInput from '@app/components/common/inputs/InputPassword/CustomPasswordInput';

const Title = styled(FormTitle)`
  margin: -0.5rem 0 1rem;
`;

const Footer = styled.div`
  margin: 1rem 0 -1rem;
  text-align: center;
`;

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);

  const { t } = useTranslation();

  const handleSubmit = (values: SignUpRequest) => {
    setLoading(true);
    dispatch(doSignUp(values))
      .unwrap()
      .then(() => {
        notificationController.success({
          message: t('auth.signUpSuccessMessage'),
          description: t('auth.signUpSuccessDescription'),
        });
        navigate('/auth/login');
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional">
        <Title>{t('auth.signUp')}</Title>
        <Auth.FormItem
          name="name"
          label={t('common.firstName')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('common.firstName')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="surname"
          label={t('common.lastName')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('common.lastName')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="emailAddress"
          label={t('auth.email')}
          rules={[
            { required: true, message: t('common.requiredField') },
            {
              type: 'email',
              message: t('auth.notValidEmail'),
            },
          ]}
        >
          <Auth.FormInput placeholder={t('auth.email')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('auth.password')}
          name="password"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <CustomPasswordInput placeholder={t('auth.password')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('auth.confirmPassword')}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: t('common.requiredField') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('auth.confirmPasswordError')));
              },
            }),
          ]}
        >
          <Auth.FormInputPassword placeholder={t('auth.confirmPassword')} />
        </Auth.FormItem>
        {/* <Auth.ActionsWrapper>
          <BaseForm.Item name="termOfUse" valuePropName="checked" noStyle>
            <Auth.FormCheckbox>
              <Auth.Text>
                {t('auth.agree') + ' '}
                <Link to="/" target={'_blank'}>
                  <Auth.LinkText>{t('auth.termOfUse')}</Auth.LinkText>
                </Link>
                {' ' + t('common.and') + ' '}
                <Link to="/" target={'_blank'}>
                  <Auth.LinkText>{t('auth.privacyPolicy')}</Auth.LinkText>
                </Link>
              </Auth.Text>
            </Auth.FormCheckbox>
          </BaseForm.Item>
        </Auth.ActionsWrapper> */}
        <div style={{ marginBottom: '1.5rem' }} />
        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('auth.signUp1')}
          </Auth.SubmitButton>
        </BaseForm.Item>
        <Footer>
          <Auth.Text>
            {t('auth.alreadyHaveAccount')}
            <Link to="/auth/login">
              <Auth.LinkText>{t('common.here')}</Auth.LinkText>
            </Link>
          </Auth.Text>
        </Footer>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
