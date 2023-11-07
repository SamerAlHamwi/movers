import React, { useState } from 'react';
import { Config } from '@app/interfaces/interfaces';
import { EmailSetting } from './EmailSetting';
import { Col, Row } from 'antd';

export const Configurations: React.FC = () => {
  return (
    <>
      {/* <Card title={t('config.configList')}> */}
      <Row gutter={16}>
        <Col span={12}>
          <EmailSetting />
        </Col>
      </Row>
      {/* </Card> */}
    </>
  );
};
