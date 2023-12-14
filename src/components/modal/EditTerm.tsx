import React, { useEffect, useState } from 'react';
import { Space, Modal } from 'antd';
import { CreateNotificationModalProps, EditNotifactionprops, EditTermprops } from './ModalProps';
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
import { Term } from '../Admin/Terms';
import { AR } from '@app/constants/appConstants';
import { INDEX_ONE, INDEX_TWO } from '@app/constants/indexes';

export const EditTerm: React.FC<EditTermprops> = ({ visible, onCancel, onEdit, Term_values, isLoading }) => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const [form] = BaseForm.useForm();
  const [current, setCurrent] = useState(0);
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [attachments, setAttachments] = useState<any[]>([]);
  const [lang, setLang] = useState<any>({
    en: undefined,
    ar: undefined,
  });

  useEffect(() => {
    if (Term_values) {
      const firstElement = Term_values?.translations[0];
      if (firstElement?.language === AR) {
        setLang({
          ar: INDEX_ONE,
          en: INDEX_TWO,
        });
      } else {
        setLang({
          ar: INDEX_TWO,
          en: INDEX_ONE,
        });
      }
    }
  }, [Term_values]);

  useEffect(() => {
    isLoading ? '' : Term_values !== undefined && form.setFieldsValue(Term_values);
  }, [Term_values, isLoading]);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (data: Term) => {
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
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('terms.editTermModalTitle')}
        </div>
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
              <P1>{t('common.saveEdit')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} layout="vertical" onFinish={onFinish} name="userForm">
        <BaseForm.Item
          name={['translations', lang.en, 'title']}
          label={<LableText>{t(`notifications.englishtitle`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>

        <BaseForm.Item
          name={['translations', lang.en, 'description']}
          label={<LableText>{t(`notifications.englishdescription`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', lang.ar, 'title']}
          label={<LableText>{t(`notifications.arabictitle`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
            },
          ]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl', fontFamily: FONT_FAMILY.ar }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', lang.ar, 'description']}
          label={<LableText>{t(`notifications.arabicdiscription`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
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
