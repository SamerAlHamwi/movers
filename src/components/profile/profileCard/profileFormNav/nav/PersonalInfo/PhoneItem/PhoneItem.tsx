import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import * as S from './PhoneItem.styles';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneItemsProps {
  required?: boolean;
  onClick?: () => void;
  verified?: boolean;
  onFormattedValueChange?: (formattedValue: string) => void;
}

export const PhoneItem: React.FC<PhoneItemsProps> = ({ required, onClick, verified, onFormattedValueChange }) => {
  const { t } = useTranslation();
  const [FormattedValue, setFormattedValue] = useState('');

  const handlePhoneInputChange = (value: string) => {
    setFormattedValue(value);

    // Call the callback function to notify the parent component about the value change
    if (onFormattedValueChange) {
      onFormattedValueChange(value);
      console.log(value);
    }
  };

  return (
    <BaseButtonsForm.Item
      name="phoneNumber"
      $isSuccess={verified}
      $successText={t('auth.phoneNumberVerified')}
      label={t('common.phoneNumber')}
      rules={[
        { required, message: t('common.requiredField') },
        () => ({
          validator(_, value) {
            if (FormattedValue.length > 12) {
              return Promise.reject(new Error(t('auth.phoneNumberIsTooLong')));
            }
            if (!value || isValidPhoneNumber(value)) {
              return Promise.resolve();
            }
            return Promise.reject(new Error(t('auth.phoneNumberWrongNumber')));
          },
        }),
      ]}
    >
      <PhoneInput
        onChange={handlePhoneInputChange}
        country={'ae'}
        disabled={verified}
        enableLongNumbers={false}
        onClick={onClick}
      />
      {/* <S.PhoneNumberInput disabled={verified} className="ant-input" onClick={onClick} /> */}
    </BaseButtonsForm.Item>
  );
};
