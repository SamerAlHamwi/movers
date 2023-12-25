import React, { useState } from 'react';
import { Modal, Select, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { EditContactProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { ContactUsModel, LanguageType } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';
import { TextArea, Input } from '../Admin/Translations';
import { TimePicker } from 'antd';
import { DAYS_OF_WEEK_NAME, PHONE_NUMBER_CODE, PHONE_NUMBER_LENGTH } from '@app/constants/appConstants';
import { validationInputNumber } from '../functions/ValidateInputNumber';
import { isValidPhoneNumber } from 'react-phone-number-input';
const { Option } = Select;

export const EditContactUs: React.FC<EditContactProps> = ({ visible, onCancel, contact_values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();
  const [timeRange, setTimeRange] = useState<string[]>([]);

  const onOk = () => {
    form.submit();
  };

  const getTime = (timeRange: string[]) => {
    setTimeRange(timeRange);
  };

  const onFinish = (contactInfo: ContactUsModel) => {
    contactInfo = Object.assign({}, contactInfo, {
      translations: [
        {
          name: contactInfo.translations[0].name,
          address: contactInfo.translations[0].address,
          description: contactInfo.translations[0].description,
          language: 'ar' as LanguageType,
        },
        {
          name: contactInfo.translations[1].name,
          address: contactInfo.translations[1].address,
          description: contactInfo.translations[1].description,
          language: 'en' as LanguageType,
        },
      ],
      startTime: timeRange[0],
      endTime: timeRange[1],
    });
    onEdit(contactInfo);
  };

  return (
    <Modal
      style={{ marginTop: '0rem', height: '90vh', overflowY: 'scroll' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('contactUs.editContactModalTitle')}
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
      <BaseForm form={form} initialValues={contact_values} layout="vertical" onFinish={onFinish} name="CitiesForm">
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
          name={['translations', 1, 'address']}
          label={<LableText>{t('common.address_en')}</LableText>}
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
          name={['translations', 0, 'address']}
          label={<LableText>{t('common.address_ar')}</LableText>}
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
          name={['translations', 1, 'description']}
          label={<LableText>{t('common.description_en')}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea
            style={{
              textAlign: 'left',
              direction: 'ltr',
              fontFamily: FONT_FAMILY.en,
              height: '5.015rem',
            }}
          />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 0, 'description']}
          label={<LableText>{t('common.description_ar')}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea
            style={{
              textAlign: 'right',
              direction: 'rtl',
              fontFamily: FONT_FAMILY.ar,
              height: '5.015rem',
            }}
          />
        </BaseForm.Item>

        <BaseForm.Item
          name="emailAddress"
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              type: 'email',
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.invalidEmail')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.emailAddress')}</LableText>}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="phoneNumber"
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.phoneNumber')}</LableText>}
          rules={[
            { required: true, message: t('common.requiredField') },
            () => ({
              validator(_, value) {
                if (!value || isValidPhoneNumber(value)) {
                  return Promise.resolve();
                }
                if (value.length > PHONE_NUMBER_LENGTH) {
                  return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                } else if (value.length < PHONE_NUMBER_LENGTH) {
                  return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                }
              },
            }),
          ]}
        >
          <Input
            addonBefore={PHONE_NUMBER_CODE}
            onChange={(e: any) => {
              if (validationInputNumber(e.target.value)) {
                form.setFieldValue(['phoneNumber'], e.target.value);
              } else form.setFieldValue(['phoneNumber'], '');
            }}
            maxLength={9}
          />
        </BaseForm.Item>
        <BaseForm.Item
          name="facebook"
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.facebook')}</LableText>}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="instgram"
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.instgram')}</LableText>}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="twitter"
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.twitter')}</LableText>}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name={'startDay'}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.startDate')}</LableText>}
        >
          <Select>
            {DAYS_OF_WEEK_NAME.map((item: any) => {
              return (
                <Option key={item?.day} value={item?.day}>
                  {t(`contactUs.daysOfWeek.${item?.dayName}`)}
                </Option>
              );
            })}
          </Select>
        </BaseForm.Item>

        <BaseForm.Item
          name={'endDay'}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.endDate')}</LableText>}
        >
          <Select>
            {DAYS_OF_WEEK_NAME.map((item: any) => {
              return (
                <Option key={item?.day} value={item?.day}>
                  {t(`contactUs.daysOfWeek.${item?.dayName}`)}
                </Option>
              );
            })}
          </Select>
        </BaseForm.Item>

        <BaseForm.Item
          name="time"
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.workingTime')}</LableText>}
        >
          <TimePicker.RangePicker onChange={(date, dateString) => getTime(dateString)} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
