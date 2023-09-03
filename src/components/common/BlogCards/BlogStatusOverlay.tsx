import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@app/components/header/components/profileDropdown/ProfileOverlay/ProfileOverlay.styles';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { Button } from '../buttons/Button/Button';
import { Col, Row } from 'antd';

export interface BlogStatusProps {
  setTemp: (e: RadioChangeEvent) => void;
  temp: any;
  onClick_reset: () => void;
  onClick_apply: () => void;
  blogStatus?: boolean | undefined;
}

export const BlogStatusOverlay: React.FC<BlogStatusProps> = ({
  setTemp,
  temp,
  onClick_apply,
  onClick_reset,
  blogStatus,
}) => {
  const { t } = useTranslation();
  return (
    <RadioGroup
      size="small"
      onChange={(e: RadioChangeEvent) => {
        setTemp(e);
      }}
      value={temp}
    >
      <div style={{ padding: '2px 8px' }}>
        <Row gutter={[5, 5]}>
          <Col>
            <Radio style={{ display: 'block' }} value={true}>
              <Text>{t('common.active')}</Text>
            </Radio>
            <Radio style={{ display: 'block' }} value={false}>
              <Text>{t('common.inactive')}</Text>
            </Radio>
          </Col>
          <Col>
            <Row gutter={[5, 5]} style={{ marginBottom: '.35rem' }}>
              <Col>
                <Button disabled={blogStatus === undefined ? true : false} size="small" onClick={onClick_reset}>
                  <Text>{t('common.reset')}</Text>
                </Button>
              </Col>
              <Col>
                <Button size="small" type="ghost" onClick={onClick_apply}>
                  <Text>{t('common.apply')}</Text>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </RadioGroup>
  );
};
