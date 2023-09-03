import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { labelStyle, LableText } from '@app/components/GeneralStyles';
import { BaseFormItem } from '@app/components/common/forms/components/BaseFormItem/BaseFormItem';
import { Input as In, TextArea as TA } from '@app/components/common/inputs/Input/Input';
import { FONT_FAMILY, media } from '@app/styles/themes/constants';
import { Translation } from '@app/interfaces/interfaces';

export const Input = styled(In)`
  font-size: 1rem;
  display: block;
  width: 100%;
  @media only screen and ${media.md} {
    font-size: 1.09rem;
  }
  @media only screen and ${media.xl} {
    font-size: 1.12rem;
  }
`;

export const TextArea = styled(TA)`
  font-size: 1rem;
  display: block;
  width: 100%;
  @media only screen and ${media.md} {
    font-size: 1.09rem;
  }
  @media only screen and ${media.xl} {
    font-size: 1.12rem;
  }
`;

interface transSteps {
  translationCurrent: number;
  translations: Translation[];
}

export const Translations: React.FC<transSteps> = ({ translationCurrent, translations }) => {
  const { t } = useTranslation();

  return (
    <>
      {translations?.map((_, i) => (
        <div
          key={i}
          style={{
            display: translationCurrent !== i ? 'none' : 'inherit',
            marginTop: '1.25rem',
          }}
        >
          <label style={labelStyle}>{<LableText>{t('createGame.gameTitle')}</LableText>}</label>
          <BaseFormItem
            key={i}
            name={['translations', i, 'title']}
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Input
              style={
                i === 1
                  ? { fontFamily: FONT_FAMILY.ar, textAlign: 'right', direction: 'rtl' }
                  : { fontFamily: FONT_FAMILY.en, textAlign: 'left', direction: 'ltr' }
              }
            />
          </BaseFormItem>

          <label style={labelStyle}>{<LableText>{t('createGame.gameDescription')}</LableText>}</label>
          <BaseFormItem
            key={i}
            name={['translations', i, 'description']}
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <TextArea
              style={
                i === 1
                  ? { fontFamily: FONT_FAMILY.ar, textAlign: 'right', direction: 'rtl' }
                  : { fontFamily: FONT_FAMILY.en, textAlign: 'left', direction: 'ltr' }
              }
            />
          </BaseFormItem>
        </div>
      ))}
    </>
  );
};
