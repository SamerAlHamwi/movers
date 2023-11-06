import React from 'react';
import { Col, Row as R } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import styled from 'styled-components';
import { media } from '@app/styles/themes/constants';
import { useTranslation } from 'react-i18next';
import ServiceStatistics from '@app/components/Admin/Statistics/ServiceStatistics';
import GeneralStatistics from '@app/components/Admin/Statistics/GeneralStatistics';
import CitiesStatistics from '@app/components/Admin/Statistics/CitiesStatistics';
import CompaniesStatistics from '@app/components/Admin/Statistics/CompaniesStatistics';
import BranchesStatistics from '@app/components/Admin/Statistics/BranchesStatistics';
import UsersStatistics from '@app/components/Admin/Statistics/UsersStatistics';
import UsersInYearStatistics from '@app/components/Admin/Statistics/UsersInYearStatistics';
import RequestsInTimeLineStatistics from '@app/components/Admin/Statistics/RequestsStatistics';
import UsersViaBrokersStatistics from '@app/components/Admin/Statistics/UsersViaBrokersStatistics';

const Row = styled(R)`
  @media only screen and ${media.xl} {
    padding: 1.3rem 2.3rem 2rem 2.3rem;
  }
`;

const Statistics: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.Statistics')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col id="GeneralStatistics" xs={24}>
          <GeneralStatistics />
        </Col>

        <Col id="RequestsInTimeLineStatistics" xs={24}>
          <RequestsInTimeLineStatistics />
        </Col>

        <Col id="UsersInYearStatistics" xs={24}>
          <UsersInYearStatistics />
        </Col>

        <Col id="UsersStatistics" xs={24}>
          <UsersStatistics />
        </Col>

        <Col id="UsersViaBrokersStatistics" xs={24}>
          <UsersViaBrokersStatistics />
        </Col>

        {/* <Col id="CompaniesStatistics" xs={24}>
          <CompaniesStatistics />
        </Col> */}

        <Col id="BranchesStatistics" xs={24}>
          <BranchesStatistics />
        </Col>

        <Col id="ServiceStatistics" xs={12}>
          <ServiceStatistics />
        </Col>

        <Col id="CitiesStatistics" xs={12}>
          <CitiesStatistics />
        </Col>
      </Row>
    </>
  );
};

export default Statistics;
