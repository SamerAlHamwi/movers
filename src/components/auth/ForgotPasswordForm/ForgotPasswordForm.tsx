import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import * as S from './ForgotPasswordForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';
import { doResetPassword } from '@app/store/slices/authSlice';
import { ResetPasswordRequest } from '@app/services/auth';

export const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (values: ResetPasswordRequest) => {
    setLoading(true);
    dispatch(doResetPassword(values))
      .unwrap()
      .then(() => {
        navigate('/auth/security-code');
      })
      .catch((error) => {
        notificationController.error({
          message: error.message || error.error?.message || t('common.error'),
        });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional">
        <Auth.BackWrapper onClick={() => navigate(-1)}>
          <Auth.BackIcon />
          {t('common.back')}
        </Auth.BackWrapper>

        <Auth.FormTitle>{t('auth.resetPassword')}</Auth.FormTitle>
        <S.Description>{t('auth.resetPasswordDescription')}</S.Description>

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

        <BaseForm.Item noStyle>
          <S.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('auth.sendInstructions')}
          </S.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
