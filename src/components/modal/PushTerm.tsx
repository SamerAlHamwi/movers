import React from 'react';
import { Space, Modal } from 'antd';
import { CreateNotificationModalProps, CreateTermModalProps, CreateprivacyModalProps } from './ModalProps';
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
import { LanguageType } from '@app/interfaces/interfaces';
import { PrivacyPolicy } from '../Admin/PrivacyPolicy';

export const PushTerm: React.FC<CreateTermModalProps> = ({ visible, onCreateTerm, onCancel, isManager, isLoading }) => {
  const { isDesktop, isTablet } = useResponsive();
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: PrivacyPolicy) => {
    let data = {
      title: 'string',
      description: 'string',
      translations: [
        {
          title: value.translations[0].title,
          description: value.translations[0].description,
          language: 'en' as LanguageType,
        },
        {
          title: value.translations[1].title,
          description: value.translations[1].description,
          language: 'ar' as LanguageType,
        },
      ],
    };
    data = user.userType === 1 ? { ...data } : data;
    onCreateTerm(data);
  };

  const buttonStyle = { height: 'auto' };
  return (
    <Modal
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>{t('notifications.sendp')}</div>
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
              <P1>{t('Terms.addterms')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} layout="vertical" onFinish={onFinish} name="userForm">
        <BaseForm.Item
          name={['translations', 0, 'title']}
          label={<LableText>{t(`notifications.englishtitle`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 0, 'description']}
          label={<LableText>{t(`notifications.englishdescription`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'title']}
          label={<LableText>{t(`notifications.arabictitle`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl', fontFamily: FONT_FAMILY.ar }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'description']}
          label={<LableText>{t(`notifications.arabicdiscription`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};