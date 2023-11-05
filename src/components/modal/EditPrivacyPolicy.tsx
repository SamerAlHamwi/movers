import React, { useEffect, useState } from 'react';
import { Space, Modal } from 'antd';
import { Editprivacyprops } from './ModalProps';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';
import { Button } from '../common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { P1 } from '../common/typography/P1/P1';
import { LableText } from '@app/components/GeneralStyles';
import { TextArea } from '../Admin/Translations';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { LanguageType } from '@app/interfaces/interfaces';
import { PrivacyPolicy } from '../Admin/PrivacyPolicy';

export const EditPrivacyPolicy: React.FC<Editprivacyprops> = ({
  visible,
  onCancel,
  onEdit,
  Priv_values,
  isLoading,
}) => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const [form] = BaseForm.useForm();
  const [current, setCurrent] = useState(0);
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    isLoading ? '' : Priv_values !== undefined && form.setFieldsValue(Priv_values);
  }, [Priv_values, isLoading]);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (data: PrivacyPolicy) => {
    const edited_data = {
      title: data.title,
      description: data.description,

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
              <P1>{t('notifications.sendp')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} layout="vertical" onFinish={onFinish} name="userForm">
        <BaseForm.Item
          name={['translations', 0, 'title']}
          label={<LableText>{t(`notifications.englishtitle`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[A-Za-z ]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>

        <BaseForm.Item
          name={['translations', 0, 'description']}
          label={<LableText>{t(`notifications.englishdescription`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[A-Za-z ]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'title']}
          label={<LableText>{t(`notifications.arabictitle`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[\u0600-\u06FF ]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
            },
          ]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl', fontFamily: FONT_FAMILY.ar }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'description']}
          label={<LableText>{t(`notifications.arabicdiscription`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[\u0600-\u06FF ]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
            },
          ]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl', fontFamily: FONT_FAMILY.ar }} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
