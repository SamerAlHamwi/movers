import styled, { css } from 'styled-components';
import { Col, Collapse, Menu } from 'antd';
import { BurgerIcon } from '@app/components/common/Burger/BurgerIcon';
import { BORDER_RADIUS, LAYOUT, media } from '@app/styles/themes/constants';

export const DropdownMenu = styled(Menu)`
  line-height: 1.5715;
  border-radius: ${BORDER_RADIUS};
  width: 6.75rem;
  @media only screen and ${media.xs || media.md} {
    width: 7.5rem;
  }
  @media only screen and ${media.lg || media.xl} {
    width: 8rem;
  }
  &.ant-dropdown-menu {
    box-shadow: var(--box-shadow);
  }
`;

export const HeaderActionWrapper = styled.div`
  cursor: pointer;
  & > .ant-btn > span[role='img'],
  .ant-badge {
    font-size: 1.25rem;

    @media only screen and ${media.md} {
      font-size: 1.625rem;
    }
  }

  & .ant-badge {
    display: inline-block;
  }
`;

export const DropdownCollapse = styled(Collapse)`
  & > .ant-collapse-item > .ant-collapse-header {
    font-weight: 600;
    font-size: 0.875rem;

    color: var(--primary-color);

    @media only screen and ${media.md} {
      font-size: 1rem;
    }
  }

  & > .ant-collapse-item-disabled > .ant-collapse-header {
    cursor: default;

    & > span[role='img'] {
      display: none;
    }
  }
`;

export const BurgerCol = styled(Col)`
  z-index: 999;
  display: flex;
`;

export const MobileBurger = styled(BurgerIcon)`
  width: 1.75rem;
  height: 1.75rem;
  margin-right: -0.5rem;
  color: var(--text-main-color);

  ${(props) =>
    props.isCross &&
    css`
      color: var(--text-secondary-color);
    `};
`;

export const SearchColumn = styled(Col)`
  padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
`;

interface ProfileColumn {
  $isTwoColumnsLayout: boolean;
  $isStudent: boolean;
}

export const ProfileColumn = styled(Col)<ProfileColumn>`
  @media only screen and ${media.md} {
    ${(props) =>
      props?.$isTwoColumnsLayout &&
      css`
        background-color: ${props?.$isStudent && `var(--sider-background-color)`};
        padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
      `}
  }
`;
