import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doSetNewPassword } from '@app/store/slices/authSlice';
import * as S from './NewPasswordForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { NewPasswordData } from '@app/services/auth';

export const NewPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (values: NewPasswordData) => {
    setLoading(true);
    dispatch(doSetNewPassword({ emailAddress: values.emailAddress, password: values.password }))
      .unwrap()
      .then(() => {
        navigate('/auth/login');
        notificationController.success({
          message: t('auth.newPasswordSuccessMessage'),
          description: t('auth.newPasswordSuccessDescription'),
        });
      })
      .catch((err) => {
        notificationController.error({ message: err.message || err.error?.messsage });
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
        <Auth.FormTitle>{t('auth.newPasswordtitle')}</Auth.FormTitle>
        <S.Description>{t('auth.newPasswordDescription')}</S.Description>

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
          name="password"
          label={t('auth.password')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('auth.password')} />
        </Auth.FormItem>

        <BaseForm.Item noStyle>
          <S.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('auth.resetPassword')}
          </S.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
