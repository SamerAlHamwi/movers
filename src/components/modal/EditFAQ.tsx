import React from 'react';
import { Modal, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../Admin/Translations';
import { EditFAQProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { faqModel, LanguageType } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';

export const EditFAQ: React.FC<EditFAQProps> = ({ visible, onCancel, values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: faqModel) => {
    console.log(info);

    const my_data = {
      translations: info.translations?.map((_, i) => ({
        ...info.translations[i],
        language: i === 0 ? ('en' as LanguageType) : ('ar' as LanguageType),
      })),
      id: 0,
    };
    onEdit(my_data);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('faq.editFAQModalTitle')}
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
      <BaseForm form={form} initialValues={values} layout="vertical" onFinish={onFinish} name="FAQForm">
        <BaseForm.Item
          name={['translations', 0, 'question']}
          label={<LableText>{t('faq.question_en')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 0, 'answer']}
          label={<LableText>{t('faq.answer_en')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name={['translations', 1, 'question']}
          label={<LableText>{t('faq.question_ar')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'answer']}
          label={<LableText>{t('faq.answer_ar')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};