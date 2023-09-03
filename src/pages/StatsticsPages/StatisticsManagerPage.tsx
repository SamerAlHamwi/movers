import React from 'react';
import { Row as R, Col } from 'antd';
import { VisitorsPieChart } from '@app/components/charts/VisitorsPieChart';
import { BarAnimationDelayChart } from '@app/components/charts/BarAnimationDelayChart/BarAnimationDelayChart';
import { ScatterChart } from '@app/components/charts/ScatterChart/ScatterChart';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import styled from 'styled-components';
import { media } from '@app/styles/themes/constants';
import { useTranslation } from 'react-i18next';

const Row = styled(R)`
  @media only screen and ${media.xl} {
    padding: 1.3rem 2.3rem 2rem 2.3rem;
  }
`;

const StatisticsManager: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.Statistics')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col id="bar-animation-delay" xs={24}>
          <BarAnimationDelayChart />
        </Col>
        <Col id="pie" xs={24} lg={12}>
          <VisitorsPieChart />
        </Col>
        <Col id="scatter" xs={24} lg={12}>
          <ScatterChart />
        </Col>
      </Row>
    </>
  );
};

export default StatisticsManager;
