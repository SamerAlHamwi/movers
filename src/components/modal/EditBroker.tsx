import React, { useState } from 'react';
import { Modal, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../Admin/Translations';
import { EditBrokerProps, EditManagerProps, EditPartnerProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Broker, Partner, UserModel } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';
import { Select, Option } from '../common/selects/Select/Select';
import { Text } from '../GeneralStyles';

export const EditBroker: React.FC<EditBrokerProps> = ({ visible, onCancel, Brokr_values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: Broker) => {
    value = Object.assign({}, value, { isActive: true });
    onEdit(value);
  };

  return (
    <Modal
      style={{ marginTop: '-4rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('Brokers.editPartnerModalTitle')}
        </div>
      }
      onCancel={onCancel}
      maskClosable={true}
      footer={
        <BaseForm.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <Space>
            <Button type="ghost" style={{ height: 'auto' }} onClick={onCancel}>
              <P1>{t('common.cancel')}</P1>
            </Button>
            <Button type="primary" style={{ height: 'auto' }} loading={isLoading} onClick={onOk}>
              <P1>{t('common.saveEdit')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} initialValues={Brokr_values} layout="vertical" onFinish={onFinish} name="userForm">
        <BaseForm.Item
          name="mediatorPhoneNumber"
          label={<LableText>{t('Brokers.partnerPhoneNumber')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <div>
          <BaseForm.Item
            name="mediatorCode"
            // Set the initialValue to the generated code
            label={<LableText>{t('Brokers.partnercode')}</LableText>}
            rules={[
              {
                required: true,
                message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
              },
            ]}
            style={{ marginTop: '-.5rem' }}
          ></BaseForm.Item>
        </div>

        <BaseForm.Item
          name="commissionPercentage"
          label={<LableText>{t('Brokers.partnerdiscountPercentage')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="mediatorProfit"
          label={<LableText>{t('Brokers.mediatorProfit')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
