import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import ComDetails from '@app/components/Admin/Companies/ComDetails';

const ComDetailsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.companies')}</PageTitle>
      <ComDetails />
    </>
  );
};

export default ComDetailsPage;
