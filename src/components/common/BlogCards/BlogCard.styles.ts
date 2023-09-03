import styled from 'styled-components';
import { Typography } from 'antd';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { MoreOutlined as M } from '@ant-design/icons';
import { Collapse as C } from '../Collapse/Collapse';

export const Header = styled.div`
  height: 5.5rem;
  padding: 1.5625rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AuthorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // margin-left: 0.625rem;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 21.25rem;
  position: relative;
  max-width: 42.5rem;
  box-shadow: var(--box-shadow);
  border-radius: ${BORDER_RADIUS};
  transition: 0.3s;
  background: var(--background-color);

  [data-theme='dark'] & {
    background: var(--secondary-background-color);
  }
  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
`;

export const Author = styled.div`
  font-size: ${FONT_SIZE.xm};
  font-weight: ${FONT_WEIGHT.bold};
  color: var(--text-main-color);
  line-height: 1.5625rem;
`;

export const InfoWrapper = styled.div`
  padding: 1.25rem;

  @media only screen and ${media.xl} {
    padding: 1rem;
  }

  @media only screen and ${media.xxl} {
    padding: 1.85rem;
  }
`;

export const InfoHeader = styled.div`
  display: flex;
  // flex-wrap: wrap;
  margin-bottom: 1rem;
  justify-content: space-between;
  @media only screen and ${media.md} {
    margin-bottom: 0.625rem;
  }
  @media only screen and ${media.xxl} {
    margin-bottom: 1.25rem;
  }
`;

export const Title = styled.div`
  font-size: ${FONT_SIZE.sm};
  font-weight: ${FONT_WEIGHT.semibold};
  width: 80%;
  line-height: 1.375rem;
  color: var(--text-main-color);
  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.md};
  }
  @media only screen and ${media.lg} {
    font-size: ${FONT_SIZE.xm};
  }
  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.lg};
  }
`;

export const DateTime = styled(Typography.Text)`
  font-size: ${FONT_SIZE.xs};
  color: var(--text-main-color);
  // line-height: 1.25rem;
  margin-top: 0.11rem;
`;

export const Description = styled.div`
  font-size: ${FONT_SIZE.xs};
  color: var(--text-main-color);
  text-align: justify;
  // margin: -0.5rem 0;
  @media only screen and ${media.xxl} {
    font-size: 1rem;
  }
`;

export const Link = styled.div`
  font-size: 0.85rem;
  color: var(--text-main-color);
  @media only screen and ${media.xl || media.md} {
    font-size: ${FONT_SIZE.sm};
  }
  :hover {
    color: var(--primary-color);
  }
  display: inline;
`;

export const SwitchWrapper = styled.div`
  display: flex;
  padding: 0 1.25rem 1.25rem;
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  padding: 0 1.25rem 1.25rem;
`;

export const Image = styled.img`
  // cursor: pointer;
  border-radius: 0.4rem;
  aspect-ratio: 3/2;
  object-fit: contain;
`;

export const MoreOutlined = styled(M)`
  font-size: ${FONT_SIZE.xxl};
  font-weight: ${FONT_WEIGHT.extraBold};
  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.xxxl};
  }
`;

export const Collapse = styled(C)`
  .ant-collapse > .ant-collapse-item > .ant-collapse-header,
  .ant-collapse-arrow {
    svg {
      font-size: ${FONT_SIZE.xs};
      color: var(--text-main-color);
      margin-bottom: 0.75rem;
      @media only screen and ${media.xxl} {
        font-size: 1rem;
      }
    }
  }
`;
