import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Notifications } from '@app/components/Admin/Notifications';
import { Companies } from '@app/components/Admin/Companies';
import { Partners } from '@app/components/Admin/Partners';

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
