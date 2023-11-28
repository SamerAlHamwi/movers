import React, { useEffect, useState } from 'react';
import { Space, Modal, Form, InputNumber, Radio, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../Admin/Translations';
import { CreateCodeModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Code } from '@app/interfaces/interfaces';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import CustomPasswordInput from '../common/inputs/InputPassword/CustomPasswordInput';

const generateRandomCode = () => {
  const min = 10000000;
  const max = 99999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const { Option } = Select;

export const ChangePasswordForUser: React.FC<CreateCodeModalProps> = ({
  visible,
  onCancel,
  onCreateCode,
  isLoading,
}) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: Code) => {
    info = Object.assign({}, info);
    onCreateCode(info);
  };

  return (
    <Modal
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('users.changePasswordModalTitle')}
        </div>
      }
      onCancel={onCancel}
      maskClosable={true}
      footer={
        <BaseForm.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <Space>
            <Button key="cancel" style={{ height: 'auto' }} type="ghost" onClick={onCancel}>
              <P1>{t('common.cancel')}</P1>
            </Button>
            <Button type="primary" style={{ height: 'auto' }} loading={isLoading} key="add" onClick={onOk}>
              <P1>{t('users.changePasswordModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="changePasswordForm">
        <Auth.FormItem
          label={t('auth.passwordAdmin')}
          name={['adminPassword']}
          rules={[
            {
              required: true,
              message: t('common.requiredField'),
            },
          ]}
        >
          <CustomPasswordInput placeholder={t('auth.password')} />
        </Auth.FormItem>

        <Auth.FormItem
          label={t('auth.passwordUser')}
          name={['newPassword']}
          rules={[
            {
              required: true,
              message: t('common.requiredField'),
            },
          ]}
        >
          <CustomPasswordInput placeholder={t('auth.password')} />
        </Auth.FormItem>
      </BaseForm>
    </Modal>
  );
};
