import React, { useEffect, useState } from 'react';
import { Space, Modal, Form, InputNumber, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../Admin/Translations';
import { CreateCodeModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Code } from '@app/interfaces/interfaces';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const generateRandomCode = () => {
  const min = 10000000;
  const max = 99999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export const AddCodesForREM: React.FC<CreateCodeModalProps> = ({ visible, onCancel, onCreateCode, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const [code, setCode] = useState(generateRandomCode());
  const [valueRadio, setValueRadio] = useState(1);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: Code) => {
    const phoneNumbers = info?.phoneNumbers == undefined ? [] : info.phoneNumbers;
    info = Object.assign({}, info, { codeType: valueRadio, phoneNumbers: phoneNumbers });
    onCreateCode(info);
  };

  return (
    <Modal
      style={{ marginTop: '-6rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('partners.addCodeModalTitle')}
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
              <P1>{t('partners.addCodeModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="REMForm">
        <BaseForm.Item
          name="rsmCode"
          initialValue={code}
          label={<LableText>{t('partners.code')}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
            {
              pattern: /^[0-9]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyNumbers')}</p>,
            },
            // {
            //   max: 8,
            //   message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('brokers.tooManyNumbers')}</p>,
            // },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input onChange={(e: any) => setCode(e.target.value)} />
        </BaseForm.Item>

        <BaseForm.Item key={10} name="codeType">
          <Radio.Group
            style={{ display: 'flex', width: '100%' }}
            onChange={(event) => {
              setValueRadio(event.target.value);
            }}
          >
            <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              discountPercentag
            </Radio>
            <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              fixedValue
            </Radio>
          </Radio.Group>
        </BaseForm.Item>

        <BaseForm.Item
          name="discountPercentage"
          label={<LableText>{t('partners.discountPercentage')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <InputNumber defaultValue={0} min={0} max={100} formatter={(value) => `${value}`} style={{ width: '100%' }} />
        </BaseForm.Item>

        <Form.List name="phoneNumbers">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <BaseForm.Item
                  className="formList"
                  {...formItemLayout}
                  label={index === 0 ? t('common.phoneNumbers') : ''}
                  required={false}
                  key={field.key}
                  style={{ position: 'relative', maxWidth: '100%', minHeight: '1px' }}
                >
                  <BaseForm.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyNumbers')}</p>,
                      },
                    ]}
                    style={{ marginTop: '-.5rem', position: 'relative', maxWidth: '100%', minHeight: '1px' }}
                  >
                    <Input placeholder={t('common.phoneNumber')} style={{ width: '100%', maxWidth: '100%' }} />
                  </BaseForm.Item>

                  {fields.length >= 1 ? (
                    <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                  ) : null}
                </BaseForm.Item>
              ))}

              <BaseForm.Item>
                <Button type="dashed" onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
                  {t('partners.addPhoneNumber')}
                </Button>
                <Form.ErrorList errors={errors} />
              </BaseForm.Item>
            </>
          )}
        </Form.List>
      </BaseForm>
    </Modal>
  );
};
