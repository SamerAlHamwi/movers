import React, { useEffect, useState } from 'react';
import { Modal, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../Admin/Translations';
import { EditRequestProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { LableText } from '../GeneralStyles';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { RequestModel } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';

export const EditRequest: React.FC<EditRequestProps> = ({ visible, onCancel, values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: RequestModel) => {
    info = Object.assign({}, info);
    onEdit(info);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('requests.editRequestModalTitle')}
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
      <BaseForm form={form} initialValues={values} layout="vertical" onFinish={onFinish} name="RequestsForm">
        <>
          <BaseForm.Item
            name={['sourceCity', 'name']}
            label={<LableText>{t('requests.sourceCity')}</LableText>}
            style={{ marginTop: '-1rem' }}
            rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          >
            <Input />
          </BaseForm.Item>
          <BaseForm.Item
            name="destinationCity"
            label={<LableText>{t('requests.destinationCity')}</LableText>}
            rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
            style={{ marginTop: '-.5rem' }}
          >
            <Input />
          </BaseForm.Item>
          <BaseForm.Item
            name="serviceType"
            label={<LableText>{t('requests.serviceType')}</LableText>}
            rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
            style={{ marginTop: '-.5rem' }}
          >
            <Input />
          </BaseForm.Item>
          <BaseForm.Item
            name="services"
            label={<LableText>{t('requests.services')}</LableText>}
            rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
            style={{ margin: '-.5rem 0 -.5rem 0' }}
          >
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option: any) => option!.children?.toLowerCase().includes(input?.toLowerCase())}
              filterSort={(optionA: any, optionB: any) =>
                optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
              }
            ></Select>
          </BaseForm.Item>
          <BaseForm.Item
            name="sourceType"
            label={<LableText>{t('requests.sourceType')}</LableText>}
            rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
            style={{ marginTop: '-.5rem' }}
          >
            <Input />
          </BaseForm.Item>
          <BaseForm.Item
            name="comment"
            label={<LableText>{t('requests.comment')}</LableText>}
            rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
            style={{ marginTop: '-.5rem' }}
          >
            <Input />
          </BaseForm.Item>
        </>
      </BaseForm>
    </Modal>
  );
};
