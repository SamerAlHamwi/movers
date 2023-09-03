import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const DesktopBrandSpan = styled.span`
  margin: 0 1.5rem;
  [data-theme='light'] & {
    color: var(--primary-gradient-color);
  }
  color: var(--white);
  font-weight: ${FONT_WEIGHT.semibold};
  font-size: ${FONT_SIZE.xxl};
  font-family: ${FONT_FAMILY.en};
`;

export const MobileBrandSpan = styled.span`
  margin: 0 0.75rem;
  [data-theme='light'] & {
    color: var(--primary-gradient-color);
  }
  color: var(--white);
  font-weight: ${FONT_WEIGHT.medium};
  font-size: ${FONT_SIZE.lg};
  font-family: ${FONT_FAMILY.en};
`;
