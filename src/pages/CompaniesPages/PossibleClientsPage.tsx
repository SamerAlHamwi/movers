import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { PossibleClients } from '@app/components/Admin/Companies/PossibleClients';

const PossibleClientsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.possibleClients')}</PageTitle>
      <PossibleClients />
    </>
  );
};

export default PossibleClientsPage;
