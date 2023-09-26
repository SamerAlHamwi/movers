import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Partners } from '@app/components/Admin/RealStateManagement';

const Partnerspage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Partners')}</PageTitle>
      <Partners />
    </>
  );
};

export default Partnerspage;
