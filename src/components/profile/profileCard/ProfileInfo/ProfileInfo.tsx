import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from 'antd';
import * as S from './ProfileInfo.styles';

// interface ProfileInfoProps {
//   profileData: UserModel | null;
// }

export const ProfileInfo: React.FC = () => {
  const [fullness] = useState(90);

  const { t } = useTranslation();

  return (
    <S.Wrapper>
      <S.ImgWrapper>
        <Avatar shape="circle" alt="Profile" />
      </S.ImgWrapper>
      <S.Title>Title</S.Title>
      <S.Subtitle>UserName</S.Subtitle>
      <S.FullnessWrapper>
        <S.FullnessLine width={fullness}>{fullness}%</S.FullnessLine>
      </S.FullnessWrapper>
      <S.Text>{t('profile.fullness')}</S.Text>
    </S.Wrapper>
  );
};
