import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AddBranch } from '@app/components/modal/AddBranch';
import { EditCom } from '@app/components/Admin/Companies/EditCom';

const EditComPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.Companies')}</PageTitle>
      <EditCom />
    </>
  );
};

export default EditComPage;
