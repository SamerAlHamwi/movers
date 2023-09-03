import React from 'react';
import * as S from './MainSider/MainSider.styles';
import { RightOutlined } from '@ant-design/icons';
import { useResponsive } from 'hooks/useResponsive';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import logoLight from '@app/assets/logo/3.png';
import logoDark from '@app/assets/logo/2.png';

interface SiderLogoProps {
  isSiderCollapsed: boolean;
  toggleSider: () => void;
}
export const SiderLogo: React.FC<SiderLogoProps> = ({ isSiderCollapsed, toggleSider }) => {
  const { tabletOnly } = useResponsive();
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);

  const img = theme === 'dark' ? logoDark : logoLight;

  return (
    <S.SiderLogoDiv>
      <S.SiderLogoLink to="/">
        {/* <img src={img} alt="MOVERS&" width={40} height={40} /> */}
        <S.BrandSpan>{t('sidebarNavigation.Brand')}</S.BrandSpan>
      </S.SiderLogoLink>
      {tabletOnly && (
        <S.CollapseButton
          shape="circle"
          size="small"
          $isCollapsed={isSiderCollapsed}
          icon={<RightOutlined rotate={isSiderCollapsed ? 0 : 180} />}
          onClick={toggleSider}
        />
      )}
    </S.SiderLogoDiv>
  );
};
