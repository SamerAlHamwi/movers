import React, { useState } from 'react';
import { Modal, Radio, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../Admin/Translations';
import { EditRejectReasonProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { LanguageType, RejectReason } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';

export const EditRejectReason: React.FC<EditRejectReasonProps> = ({ visible, onCancel, values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const [valueRadio, setValueRadio] = useState(1);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: RejectReason) => {
    value = Object.assign({}, value, {
      translations: value.translations.map((_, i) => ({
        ...value.translations[i],
        language: i === 0 ? ('en' as LanguageType) : ('ar' as LanguageType),
      })),
      possibilityPotentialClient: valueRadio,
    });
    onEdit(value);
  };

  return (
    <Modal
      style={{ marginTop: '-4rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('rejectReasons.editRejectReasonModalTitle')}
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
      <BaseForm form={form} initialValues={values} layout="vertical" onFinish={onFinish} name="EditRejectReasonForm">
        <BaseForm.Item
          key={10}
          name="possibilityPotentialClient"
          label={<LableText>{t('rejectReasons.possibilityPotentialClient')}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
          ]}
        >
          <Radio.Group
            style={{ display: 'flex', width: '100%' }}
            onChange={(event) => {
              setValueRadio(event.target.value);
            }}
          >
            <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('rejectReasons.PotentialClient')}
            </Radio>
            <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('rejectReasons.NotPotentialClient')}
            </Radio>
          </Radio.Group>
        </BaseForm.Item>

        <BaseForm.Item
          name={['translations', 0, 'description']}
          label={<LableText>{t(`common.description_en`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
            {
              pattern: /^[A-Za-z ]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name={['translations', 1, 'description']}
          label={<LableText>{t(`common.description_ar`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
            {
              pattern: /^[\u0600-\u06FF ]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
