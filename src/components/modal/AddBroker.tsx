import React, { useState } from 'react';
import { Space, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../Admin/Translations';
import { CreateBrokrModalProps, CreatePartnerModalProps, CreateUserModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { InputPassword } from '../common/inputs/InputPassword/InputPassword.styles';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Broker, Partner, UserModel } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { Text } from '../GeneralStyles';

export const AddBrokr: React.FC<CreateBrokrModalProps> = ({ visible, onCancel, onCreateBroker, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const generateRandomCode = () => {
    const min = 10000; // Minimum 5-digit number
    const max = 99999; // Maximum 5-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const [code, setCode] = useState(generateRandomCode());

  const generateNewCode = () => {
    const newCode = generateRandomCode();
    setCode(newCode);
  };

  const onOk = () => {
    form.submit();
  };

  const onFinish = (BrokerInfo: Broker) => {
    BrokerInfo = Object.assign({}, BrokerInfo, { isActive: true });
    onCreateBroker(BrokerInfo);
  };

  return (
    <Modal
      style={{ marginTop: '-6rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('Brokers.addBrokerModalTitle')}
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
              <P1>{t('Partners.addBrokerModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="PartnerForm">
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
            initialValue={code} // Set the initialValue to the generated code
            label={<LableText>{t('Brokers.partnercode')}</LableText>}
            rules={[
              {
                required: true,
                message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
              },
            ]}
            style={{ marginTop: '-.5rem' }}
          >
            <Input />
          </BaseForm.Item>
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
