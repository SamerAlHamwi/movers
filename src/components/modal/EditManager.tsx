import React, { useState } from 'react';
import { Modal, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { EditManagerProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { UserModel } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';
import { Select, Option } from '../common/selects/Select/Select';
import { Text } from '../GeneralStyles';

export const EditManager: React.FC<EditManagerProps> = ({ visible, onCancel, manager_values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();
  const [managerType, setManagerType] = useState<number>();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: UserModel) => {
    value = Object.assign({}, value, { isActive: true, type: managerType });
    onEdit(value);
  };

  return (
    <Modal
      style={{ marginTop: '-4rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('managers.editManagerModalTitle')}
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
      <BaseForm form={form} initialValues={manager_values} layout="vertical" onFinish={onFinish} name="userForm">
        <BaseForm.Item
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          name="userName"
          label={<LableText>{t('common.userName')}</LableText>}
          style={{ marginTop: '-1rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          name="name"
          label={<LableText>{t('common.firstName')}</LableText>}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          name="surname"
          label={<LableText>{t('common.lastName')}</LableText>}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          name="emailAddress"
          label={<LableText>{t('auth.email')}</LableText>}
          style={{ margin: '-.5rem 0' }}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="type"
          label={<LableText>{t('managers.type')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '1rem 0px 0' }}
        >
          <Select
            onChange={(type: any) => {
              setManagerType(type);
            }}
          >
            <Option value={1}>
              <Text>{t('managers.admin')}</Text>
            </Option>
            <Option value={4}>
              <Text>{t('managers.employee')}</Text>
            </Option>
          </Select>
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
