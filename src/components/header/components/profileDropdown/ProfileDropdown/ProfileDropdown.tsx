import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './ProfileDropdown.styles';
import { useQuery } from 'react-query';
import { getUserInformationWhenLogIn } from '@app/services/auth';
import { UserModel } from '@app/interfaces/interfaces';
import { LogoutOutlined } from '@ant-design/icons';

export const ProfileDropdown: React.FC = () => {
  const { isTablet, isMobile, isDesktop, mobileOnly } = useResponsive();
  const user = useAppSelector((state) => state.user.user);
  const [userInfo, setUserInfo] = useState<UserModel>();

  const { refetch } = useQuery(
    ['userInfo', userInfo],
    () =>
      getUserInformationWhenLogIn()
        .then((data) => {
          setUserInfo(data.data?.result);
        })
        .catch((error) => {
          console.log(error);
        }),
    {
      enabled: !userInfo,
      refetchOnReconnect: true,
    },
  );

  useEffect(() => {
    if (!userInfo) {
      refetch();
    }
  }, [userInfo, refetch]);

  return (
    <>
      <Dropdown overlay={<ProfileOverlay />} trigger={['click']}>
        <S.ProfileDropdownHeader as={Row} gutter={[10, 10]} align="middle">
          <Col>
            <LogoutOutlined style={{ fontSize: '1.625rem' }} size={mobileOnly ? 32 : 35} />
          </Col>
        </S.ProfileDropdownHeader>
      </Dropdown>
    </>
  );
};
