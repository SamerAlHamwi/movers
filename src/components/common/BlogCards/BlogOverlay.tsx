import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'antd';
import { MenuItem, Text } from '@app/components/header/components/profileDropdown/ProfileOverlay/ProfileOverlay.styles';
import styled from 'styled-components';
import { BORDER_RADIUS, media } from '@app/styles/themes/constants';

export const DropdownMenu = styled(Menu)`
  line-height: 1.5715;
  border-radius: ${BORDER_RADIUS};
  @media only screen and ${media.xs || media.md} {
    width: 7.5rem;
  }
  @media only screen and ${media.lg || media.xl} {
    width: 8.5rem;
  }
  &.ant-dropdown-menu {
    box-shadow: var(--box-shadow);
  }
`;

interface ArticleOverlayProps {
  onClick_delete: () => void;
  onClick_switch_activation?: () => void;
  onClick_edit?: () => void;
  isActive: boolean;
}

export const BlogOverlay: React.FC<ArticleOverlayProps> = ({
  onClick_delete,
  onClick_edit,
  isActive,
  onClick_switch_activation,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <DropdownMenu selectable={false} {...props}>
      <MenuItem key={0} onClick={onClick_edit}>
        <Text>{t('common.edit')}</Text>
      </MenuItem>
      <MenuItem key={1} onClick={onClick_delete}>
        <Text>{t('common.delete')}</Text>
      </MenuItem>
      <MenuItem onClick={onClick_switch_activation} key={2}>
        {isActive ? <Text>{t('common.deactivate')}</Text> : <Text>{t('common.activate')}</Text>}
      </MenuItem>
    </DropdownMenu>
  );
};
