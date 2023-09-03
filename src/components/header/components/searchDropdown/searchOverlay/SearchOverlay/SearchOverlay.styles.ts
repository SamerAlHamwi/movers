import { Menu as M } from 'antd';

import { media } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const Menu = styled(M)`
  padding: 1rem;
  max-height: 50vh;
  overflow-y: auto;
  line-height: 1.5715;
  width: auto;

  &.ant-dropdown-menu {
    box-shadow: var(--box-shadow);
  }
  @media only screen and ${media.md} {
    padding: 1rem 2rem;
  }
`;
