import React from 'react';
import { useResponsive } from '@app/hooks/useResponsive';
import { SiderLogoLink } from '@app/components/layouts/main/sider/MainSider/MainSider.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';
import logoLight from '@app/assets/logo/3.png';
import logoDark from '@app/assets/logo/2.png';
import { useTranslation } from 'react-i18next';
import { DesktopBrandSpan } from './Brand.styles';
export const Brand: React.FC = () => {
  const { t } = useTranslation();
  const { isTablet, mobileOnly } = useResponsive();
  const theme = useAppSelector((state) => state.theme.theme);
  const img = theme === 'dark' ? logoDark : logoLight;
  return (
    <>
      {mobileOnly && (
        <SiderLogoLink to="/">
          {/* <MobileBrandSpan>{t('sidebarNavigation.Brand')}</MobileBrandSpan> */}
          <img src={img} alt="MOVERS&" width={32} height={32} />
        </SiderLogoLink>
      )}
      {isTablet && (
        <SiderLogoLink to="/">
          <img src={img} alt="MOVERS&" width={40} height={40} />
          <DesktopBrandSpan>{t('sidebarNavigation.Brand')}</DesktopBrandSpan>
        </SiderLogoLink>
      )}
    </>
  );
};
