import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Notifications } from '@app/components/Admin/Notifications';
import { Companies } from '@app/components/Admin/Companies';
import { Brokers } from '@app/components/Admin/Brokers';

const Brokerspage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('Brokers.Brokers')}</PageTitle>
      <Brokers />
    </>
  );
};

export default Brokerspage;
