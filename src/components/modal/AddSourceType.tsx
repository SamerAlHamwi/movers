import React, { useState } from 'react';
import { Space, Modal, message, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../Admin/Translations';
import { CreateModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { SourceTypeModel } from '@app/interfaces/interfaces';
import { LanguageType } from '@app/interfaces/interfaces';
import { UploadDragger } from '@app/components/common/Upload/Upload';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMutation } from 'react-query';
import { Alert } from '../common/Alert/Alert';
import { uploadAttachment } from '@app/services/Attachment';

export const AddSourceType: React.FC<CreateModalProps> = ({ visible, onCancel, onCreate, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();
  const [iconId, setIconId] = useState<number>(0);
  const [urlAfterUpload, setUrlAfterUpload] = useState('');

  const uploadImage = useMutation((data: FormData) =>
    uploadAttachment(data)
      .then((data) => {
        data.data.success && (setIconId(data.data.result?.id), setUrlAfterUpload(data.data.result?.url));
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
      }),
  );

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: SourceTypeModel) => {
    const my_data = {
      iconId,
      translations: info.translations?.map((_, i) => ({
        ...info.translations[i],
        language: i === 1 ? ('en' as LanguageType) : ('ar' as LanguageType),
      })),
    };
    info = Object.assign({}, info, my_data);
    onCreate(info);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      open={visible}
      width={isDesktop ? '550px' : isTablet ? '500px' : '450px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('sourceTypes.addSourceTypeModalTitle')}
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
              <P1>{t('sourceTypes.addSourceTypeModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="SurceTypesForm">
        <BaseForm.Item
          name={['translations', 1, 'name']}
          label={<LableText>{t('common.name_en')}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 0, 'name']}
          label={<LableText>{t('common.name_ar')}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="pointsToGiftToCompany"
          label={<LableText>{t('sourceTypes.pointsToGiftToCompany')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <InputNumber min={0} max={100} formatter={(value) => `${value}`} style={{ width: '100%' }} />
        </BaseForm.Item>
        <BaseForm.Item
          name="pointsToBuyRequest"
          label={<LableText>{t('sourceTypes.pointsToBuyRequest')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <InputNumber min={0} max={100} formatter={(value) => `${value}`} style={{ width: '100%' }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={'image'}
          style={{ marginTop: '-1rem' }}
          label={<LableText>{t(`common.uploadImage`)}</LableText>}
          rules={[{ message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredImage')}</p>, required: true }]}
        >
          <UploadDragger
            maxCount={1}
            listType="text"
            accept=".jpeg,.png,.jpg"
            disabled={uploadImage.isLoading ? true : false}
            showUploadList={false}
            customRequest={({ file }) => {
              const formData = new FormData();
              formData.append('RefType', '5');
              formData.append('File', file);
              uploadImage.mutateAsync(formData);
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
              {uploadImage.isLoading ? (
                <LoadingOutlined
                  style={{
                    color: 'var(--primary-color)',
                    fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                  }}
                />
              ) : urlAfterUpload ? (
                <img src={urlAfterUpload} style={{ width: 'auto', height: isDesktop || isTablet ? '42px' : '35px' }} />
              ) : (
                <InboxOutlined
                  style={{
                    color: 'var(--primary-color)',
                    fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                  }}
                />
              )}
              <p
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.xm : FONT_SIZE.sm,
                  color: 'var(--text-main-color)',
                }}
              >
                {uploadImage.isLoading ? t('common.uploading') : t('common.draggerUploadIconDescription')}
              </p>
            </div>
          </UploadDragger>
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
