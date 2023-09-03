import React, { useEffect, useState } from 'react';
import { Avatar, Col, Row } from 'antd';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './ProfileDropdown.styles';
import { useQuery } from 'react-query';
import { FONT_SIZE } from '@app/styles/themes/constants';
// import { getUserInformationWhenLogIn } from '@app/services/auth';
import { UserModel } from '@app/interfaces/interfaces';
import { UserRole } from '@app/constants/userRole';
import { UserOutlined } from '@ant-design/icons';

export const ProfileDropdown: React.FC = () => {
  const { isTablet, isMobile, isDesktop, mobileOnly } = useResponsive();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const [userInfo, setUserInfo] = useState<UserModel>();
  const [imageUrl, setImageUrl] = useState('');

  // const { refetch } = useQuery(
  //   ['userInfo', userInfo],
  //   () =>
  //     getUserInformationWhenLogIn()
  //       .then((data) => {
  //         setUserInfo(data.data?.result);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       }),
  //   {
  //     enabled: !userInfo,
  //     refetchOnReconnect: true,
  //   },
  // );

  // useEffect(() => {
  //   if (!userInfo) {
  //     refetch();
  //   }
  // }, [userInfo, refetch]);

  const backgroundColor = theme === 'dark' ? 'rgb(18,20,48)' : 'rgb(0,91,175)';

  const name = UserRole[user.userType] === 'student' ? userInfo?.name + ' ' + userInfo?.surname : userInfo?.name;
  const avatarname = userInfo?.name?.charAt(0)?.toLowerCase();

  const fontSize = isDesktop || isTablet ? FONT_SIZE.xm : isMobile ? FONT_SIZE.sm : mobileOnly ? FONT_SIZE.xs : '';
  return (
    <>
      <Dropdown overlay={<ProfileOverlay />} trigger={['click']}>
        <S.ProfileDropdownHeader as={Row} gutter={[10, 10]} align="middle">
          <Col>
            {UserRole[user.userType] === 'student' ? (
              <S.StudentAvatar
                size={mobileOnly ? 32 : 35}
                // icon={<UserOutlined style={{ margin: '0 auto' }} />}
                shape="square"
                // onLoad={handleImageLoad}
                src={imageUrl}
              >
                <div style={{ fontSize }}>{avatarname}</div>
              </S.StudentAvatar>
            ) : (
              <Avatar size={35} shape="square" className="prevent-select" style={{ backgroundColor }}>
                <div style={{ fontSize }}>{Number.isNaN(avatarname) ? ' ' : avatarname}</div>
              </Avatar>
            )}
          </Col>
          {isTablet && <Col className="prevent-select">{userInfo === undefined ? '' : name}</Col>}
        </S.ProfileDropdownHeader>
      </Dropdown>
    </>
  );
};
