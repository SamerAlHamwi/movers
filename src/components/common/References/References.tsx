import React from 'react';
import * as S from './References.styles';
import {
  FacebookOutlined,
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  CopyrightOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@app/hooks/reduxHooks';
import i18next from 'i18next';
import { BASE_COLORS } from '@app/styles/themes/constants';
export const References: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const color = { color: theme === 'dark' ? BASE_COLORS.lightgrey : '' };
  return (
    <S.ReferencesWrapper>
      <S.Text style={color}></S.Text>
      <S.Icons style={color}>
        <CopyrightOutlined />
        <S.Text style={color}>{i18next.t('footer')}</S.Text>
      </S.Icons>

      {/* <S.Icons>
        <a href="https://github.com/altence/lightence-admin" target="_blank" rel="noreferrer">
          <GithubOutlined />
        </a>
        <a href="https://twitter.com/altence_team" target="_blank" rel="noreferrer">
          <TwitterOutlined />
        </a>
        <a href="https://www.facebook.com/groups/altence" target="_blank" rel="noreferrer">
          <FacebookOutlined />
        </a>
        <a href="https://linkedin.com/company/altence" target="_blank" rel="noreferrer">
          <LinkedinOutlined />
        </a>
      </S.Icons> */}
    </S.ReferencesWrapper>
  );
};
