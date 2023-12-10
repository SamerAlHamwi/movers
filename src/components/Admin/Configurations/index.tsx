import React from 'react';
import { Col, Row } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { EmailSetting } from './EmailSetting';
import { SmsSetting } from './SmsSetting';
import { FileSizeSetting } from './FileSize';
import { HoursInSystemSetting } from './HoursInSystem';

export const Configurations: React.FC = () => {
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  return (
    <>
      <Row gutter={20}>
        <Col span={isDesktop || isTablet ? 12 : 24} style={{ marginBottom: '2rem' }}>
          <EmailSetting />
        </Col>
        <Col span={isDesktop || isTablet ? 12 : 24} style={{ marginBottom: '2rem' }}>
          <SmsSetting />
          <FileSizeSetting />
        </Col>
        <Col span={24} style={{ marginBottom: '2rem' }}>
          <HoursInSystemSetting />
        </Col>
      </Row>
    </>
  );
};
