import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Notifications } from '@app/components/Admin/Notifications';
import { Companies } from '@app/components/Admin/Companies';

const Companiespage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('Companies.companies')}</PageTitle>
      <Companies />
    </>
  );
};

export default Companiespage;
