import React, { useEffect, useState } from 'react';
import { Space, Modal } from 'antd';
import { CreateNotificationModalProps, EditNotifactionprops } from './ModalProps';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';
import { Button } from '../common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { P1 } from '../common/typography/P1/P1';
import { LableText, Text } from '@app/components/GeneralStyles';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { TextArea } from '../Admin/Translations';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { Notification } from '@app/components/Admin/Notifications';
import { LanguageType, NotModal } from '@app/interfaces/interfaces';
import { useMutation } from 'react-query';

export const EditNotifaction: React.FC<EditNotifactionprops> = ({
  visible,
  onCancel,
  onEdit,
  Not_values,
  isLoading,
}) => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const [form] = BaseForm.useForm();
  const [current, setCurrent] = useState(0);
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    isLoading ? '' : Not_values !== undefined && form.setFieldsValue(Not_values);
  }, [Not_values, isLoading]);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (data: Notification) => {
    const edited_data = {
      destination: data.destination,
      id: data.id,
      translations: data.translations.map((_, i) => ({
        ...data.translations[i],
        language: i === 0 ? ('en' as LanguageType) : ('ar' as LanguageType),
      })),
    };
    onEdit(edited_data);
  };

  const buttonStyle = { height: 'auto' };
  return (
    <Modal
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>{t('notifications.send')}</div>
      }
      onCancel={onCancel}
      maskClosable={true}
      footer={
        <BaseForm.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <Space>
            <Button style={buttonStyle} key="cancel" type="ghost" onClick={onCancel}>
              <P1>{t('common.cancel')}</P1>
            </Button>
            <Button style={buttonStyle} loading={isLoading} key="save" type="primary" onClick={onOk}>
              <P1>{t('notifications.send')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} layout="vertical" onFinish={onFinish} name="userForm">
        <BaseForm.Item
          style={{ marginTop: '-1rem' }}
          name={`destination`}
          label={<LableText>{t(`notifications.destination.destination`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
        >
          <Select>
            <Option value={0}>
              <Text>{t('notifications.destination.all')}</Text>
            </Option>
            <Option value={1}>
              <Text>{t('notifications.destination.Users')}</Text>
            </Option>
            <Option value={2}>
              <Text>{t('notifications.destination.companies')}</Text>
            </Option>
          </Select>
        </BaseForm.Item>

        <BaseForm.Item
          name={['translations', 0, 'message']}
          label={<LableText>{t(`notifications.englishMessage`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'message']}
          label={<LableText>{t(`notifications.arabicMessage`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl', fontFamily: FONT_FAMILY.ar }} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
