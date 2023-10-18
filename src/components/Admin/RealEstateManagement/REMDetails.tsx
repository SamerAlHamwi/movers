import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Row, Tree, Image, Tag, Space, Progress } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { getPartner } from '@app/services/partners';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { DataNode } from 'antd/es/tree';
import { Button } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined } from '@ant-design/icons';
import { TextBack } from '@app/components/GeneralStyles';

export type specifierType = {
  name: string;
  value: number | undefined;
};

export type partnerData = {
  companyCode: string;
  id: number;
};

const treeStyle = {
  width: '96%',
  margin: '0 2%',
  padding: '0.5rem',
  borderRadius: '0.25rem',
  border: '1px solid #d9d9d9',
  backgroundColor: '#fff',
};

let treeData: DataNode[] = [];

const REMDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { partnerId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [partnerData, setCompanyData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const { refetch, isRefetching } = useQuery(['getPartner'], () =>
    getPartner(partnerId)
      .then((data) => {
        const result = data.data?.result;
        setCompanyData(result);
        setLoading(!data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
        setLoading(false);
      }),
  );

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  if (partnerData && partnerData?.codes) {
    treeData = partnerData?.codes.map((code: any) => ({
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <span style={{ fontWeight: 'bold' }}>
            <p style={{ color: '#01509a', display: 'inline' }}> {code?.rsmCode}</p> /
            <p style={{ color: '#30af5b', display: 'inline' }}> {code?.discountPercentage}%</p>
          </span>
        </span>
      ),
      key: code?.rsmCode,
      children: code?.phonesNumbers.map((phonesNumber: any, index: number) => ({
        title: (
          <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
            <span style={{ fontWeight: 'bold' }}>
              {index + 1} - {phonesNumber}
            </span>
          </span>
        ),
        key: phonesNumber,
      })),
    }));
  }

  const DetailsRow = styled.div`
    display: flex;
    justify-content: flex-start;
  `;

  const DetailsTitle = styled.div`
    color: var(--text-light-color);
    font-size: ${FONT_SIZE.lg};
    font-weight: ${FONT_WEIGHT.semibold};
    margin-right: 0.5rem;
    width: 100%;
  `;

  const DetailsValue = styled.div`
    color: var(--text-main-color);
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.medium};
    margin-bottom: 1rem;
  `;

  const ColStyle =
    isDesktop || isTablet
      ? styled.div`
          width: 46%;
          margin: 0 2%;
        `
      : styled.div`
          width: 80%;
          margin: 0 10%;
        `;

  const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin: 1.25rem 0.5rem;
  `;

  const conicPinkColors = { '0%': '#ffba6f', '50%': '#ff6f61', '100%': '#ff4369' };
  const conicGreenColors = { '0%': '#f6ff00', '50%': '#b3ff00', '100%': '#73d13d' };
  const conicBlueColors = { '0%': '#a6dcef', '50%': '#2e93e5', '100%': '#0050b3' };
  const conicRedColors = { '0%': '#ffbb96', '50%': '#ff6b45', '100%': '#e62b1d' };

  useEffect(() => {
    if (isRefetching) {
      setLoading(true);
    } else setLoading(false);
  }, [isRefetching, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [refetch, language]);

  return (
    <>
      <PageTitle>{t('partners.partnerInfo')}</PageTitle>
      <Row justify={'end'}>
        <Button
          style={{
            margin: '1rem 1rem 1rem 0',
            width: 'auto',
            height: 'auto',
          }}
          type="ghost"
          onClick={() => Navigate(-1)}
          icon={<LeftOutlined />}
        >
          <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
        </Button>
      </Row>
      <Row>
        <Cardd
          title={t('partners.partnerInfo')}
          padding="0 1.25rem 1rem 1.25rem"
          style={{ width: '100%', height: 'auto' }}
        >
          <Spinner spinning={loading}>
            <Details>
              <h3 style={{ paddingTop: '2rem', margin: '0 2% 1rem' }}>{t('partners.generalInfo')} :</h3>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.firstName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{partnerData?.firstName ? partnerData?.firstName : '___'}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.lastName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{partnerData?.lastName ? partnerData?.lastName : '___'}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('partners.companyName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{partnerData?.companyName ? partnerData?.companyName : '___'}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.phoneNumber')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{partnerData?.partnerPhoneNumber}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.emailAddress')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{partnerData?.email ? partnerData?.email : '___'}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('partners.citiesPartner')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  {partnerData?.citiesPartner.length > 0
                    ? partnerData?.citiesPartner.map((city: any, index: number) => (
                        <DetailsValue key={city?.id}>
                          {index + 1} - {city?.name + ' / ' + city?.country?.name}
                        </DetailsValue>
                      ))
                    : '___'}
                </ColStyle>
              </DetailsRow>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('partners.codes')} :
              </h3>

              <Tree
                className="specialTree"
                key={100}
                style={treeStyle}
                defaultExpandAll
                defaultExpandParent
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onExpand={onExpand}
                treeData={treeData as DataNode[]}
              />
            </Details>
          </Spinner>
        </Cardd>
      </Row>
    </>
  );
};

export default REMDetails;
