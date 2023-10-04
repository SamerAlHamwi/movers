import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Mediators } from '@app/components/Admin/Brokers';

const Brokerspage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Mediator')}</PageTitle>
      <Mediators />
    </>
  );
};

export default Brokerspage;
