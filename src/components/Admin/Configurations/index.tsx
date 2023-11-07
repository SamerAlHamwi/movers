import React from 'react';
import { Col, Row } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { EmailSetting } from './EmailSetting';
import { SmsSetting } from './SmsSetting';

export const Configurations: React.FC = () => {
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  return (
    <>
      {/* <Card title={t('config.configList')}> */}
      <Row gutter={20}>
        <Col span={isDesktop || isTablet ? 12 : 24}>
          <EmailSetting />
        </Col>
        <Col span={isDesktop || isTablet ? 12 : 24}>
          <SmsSetting />
        </Col>
      </Row>
      {/* </Card> */}
    </>
  );
};
