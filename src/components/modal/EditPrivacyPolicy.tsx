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
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { LanguageType } from '@app/interfaces/interfaces';
import { PrivacyPolicy } from '../Admin/PrivacyPolicy';
import { AR } from '@app/constants/appConstants';
import { INDEX_ONE, INDEX_TWO } from '@app/constants/indexes';

export const EditPrivacyPolicy: React.FC<Editprivacyprops> = ({
  visible,
  onCancel,
  onEdit,
  Priv_values,
  isLoading,
  title,
}) => {
  const { t } = useTranslation();
  const [form] = BaseForm.useForm();
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [lang, setLang] = useState<any>({
    en: undefined,
    ar: undefined,
  });

  useEffect(() => {
    if (Priv_values) {
      const firstElement = Priv_values?.translations[0];
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
  }, [Priv_values]);

  useEffect(() => {
    isLoading ? '' : Priv_values !== undefined && form.setFieldsValue(Priv_values);
  }, [Priv_values, isLoading]);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: PrivacyPolicy) => {
    info = Object.assign({}, info, {
      translations: [
        {
          title: info.translations[0].title,
          description: info.translations[0].description,
          language: 'en' as LanguageType,
        },
        {
          title: info.translations[1].title,
          description: info.translations[1].description,
          language: 'ar' as LanguageType,
        },
      ],
    });
    onEdit(info);
  };

  return (
    <Modal
      style={{ marginTop: '-4rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {/* {t('privacyPolicy.editPrivacyModalTitle')} */}
          {t(`${title}`)}
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
            <Button type="primary" style={{ height: 'auto' }} loading={isLoading} key="edit" onClick={onOk}>
              <P1>{t('common.saveEdit')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm
        form={form}
        layout="vertical"
        initialValues={Priv_values}
        onFinish={onFinish}
        name="editPrivacyPolicyForm"
      >
        <BaseForm.Item
          name={['translations', 0, 'title']}
          label={<LableText>{t(`common.title_en`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 0, 'description']}
          label={<LableText>{t(`common.description_en`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'title']}
          label={<LableText>{t(`common.title_ar`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl', fontFamily: FONT_FAMILY.ar }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'description']}
          label={<LableText>{t(`common.description_ar`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
