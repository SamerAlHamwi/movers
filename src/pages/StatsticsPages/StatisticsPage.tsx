import React from 'react';
import { Col, Row as R } from 'antd';
import { GradientStackedAreaChart } from '@app/components/charts/GradientStackedAreaChart/GradientStackedAreaChart';
import { VisitorsPieChart } from '@app/components/charts/VisitorsPieChart';
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
const Statistics: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.Statistics')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col id="gradient-stacked-area" xs={24}>
          <GradientStackedAreaChart />
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

export default Statistics;
