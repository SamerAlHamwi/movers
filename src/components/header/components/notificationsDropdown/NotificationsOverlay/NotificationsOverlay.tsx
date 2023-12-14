import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';
import { Menu } from 'antd';
import styled from 'styled-components';
import { useResponsive } from '@app/hooks/useResponsive';
import { Spinner } from '@app/components/common/Spinner/Spinner.styles';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Button } from '@app/components/common/buttons/Button/Button';
import no_notifications from '@app/assets/images/no_notifications.webp';
import { Notification } from '@app/components/common/Notification/Notification';

export type Message = {
  id: string;
  message: string;
  dateTime?: string;
  state: 0 | 1;
};

interface NotificationsOverlayProps {
  notifications: Message[] | undefined;
  setNotifications?: (state: Message[]) => void;
  loading: boolean;
  LoadMore: () => void;
  totalCount: number;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({
  notifications,
  setNotifications,
  LoadMore,
  loading,
  totalCount,
  ...props
}) => {
  const { t } = useTranslation();
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();

  const noticesList = notifications?.map((notification, index) => (
    <Notification
      key={index}
      id={notification.id}
      state={notification.state}
      message={notification.message}
      dateTime={notification.dateTime}
    />
  ));

  const NoticesOverlayMenu = styled(Menu)`
    padding: 12px 16px;
    border-right: 0;
    width: ${isTablet ? '25rem' : isMobile ? '20rem' : mobileOnly ? '18rem' : '20rem'};
    max-height: 20rem;
    overflow-y: scroll;
    cursor: default;
    &.ant-dropdown-menu {
      box-shadow: var(--box-shadow);
    }
  `;

  const Text = styled.p`
    text-align: center;
    font-size: ${isDesktop ? FONT_SIZE.lg : isTablet ? FONT_SIZE.xm : FONT_SIZE.xs};
  `;

  return (
    <Spinner spinning={loading} size="small">
      <NoticesOverlayMenu mode="inline" {...props}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text>{t('common.loading')}</Text>
              </div>
            ) : notifications !== undefined && notifications?.length > 0 ? (
              <>
                <>{noticesList}</>
                {notifications.length >= totalCount ? null : (
                  <Button style={{ width: '100%', paddingTop: '0' }} type="link" onClick={LoadMore}>
                    {t('common.loadMore')}
                  </Button>
                )}
              </>
            ) : notifications?.length === 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img width={isDesktop || isTablet ? '125px' : isMobile ? '100px' : '75px'} src={no_notifications} />
                </div>
                <Text>{t('noNotifications')}</Text>
              </>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </NoticesOverlayMenu>
    </Spinner>
  );
};
