import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Row, Tree, Image, Tag } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { getOfferById } from '@app/services/offers';
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

export type companyData = {
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

const OfferDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { offerId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [offerData, setOfferData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const { refetch, isRefetching } = useQuery(['getOfferById'], () =>
    getOfferById(offerId)
      .then((data) => {
        const result = data.data?.result;
        setOfferData(result);
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

  if (offerData && offerData?.serviceValueForOffers) {
    treeData = offerData?.serviceValueForOffers.map((service: any) => ({
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={27} height={27} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: service?.id,
      children: service?.subServices.map((subService: any) => ({
        title: (
          <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
            <Image src={subService?.attachment?.url} width={27} height={27} />
            {subService?.name}
          </span>
        ),
        key: subService?.id,
        children: subService?.tools.map((tool: any) => ({
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              <Image src={tool?.attachment?.url} width={27} height={27} />( {tool?.amount} ) {tool?.name}
            </span>
          ),
          key: tool?.id,
        })),
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
      <PageTitle>{t('offers.offerInfo')}</PageTitle>
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
        <Cardd title={t('offers.offerInfo')} padding="0 1.25rem 1rem 1.25rem" style={{ width: '100%', height: 'auto' }}>
          <Spinner spinning={loading}>
            <Details>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('offers.price')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{offerData?.price}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('offers.provider')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {offerData?.provider === 1 ? (
                    <Tag color="#01509a" style={{ padding: '4px' }}>
                      {t('offers.company')}
                    </Tag>
                  ) : offerData?.provider === 2 ? (
                    <Tag color="#30af5b" style={{ padding: '4px' }}>
                      {t('offers.branch')}
                    </Tag>
                  ) : (
                    '___'
                  )}
                </DetailsValue>
              </DetailsRow>

              {treeData.length > 0 ? (
                <>
                  <DetailsTitle style={{ margin: '0 2%' }}>{t('offers.services')}</DetailsTitle>
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
                </>
              ) : (
                <DetailsRow>
                  <DetailsTitle
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    {t('offers.services')}
                  </DetailsTitle>
                  <DetailsValue
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    ___
                  </DetailsValue>
                </DetailsRow>
              )}

              {offerData?.selectedCompanies?.company?.name && (
                <>
                  <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                    {t('offers.selectedCompany')} :
                  </h3>

                  <DetailsRow>
                    <ColStyle>
                      <DetailsTitle>{t('offers.companyName')}</DetailsTitle>
                    </ColStyle>
                    <ColStyle>
                      <DetailsValue>{offerData?.selectedCompanies?.company?.name}</DetailsValue>
                    </ColStyle>
                  </DetailsRow>

                  <DetailsRow>
                    <ColStyle>
                      <DetailsTitle>{t('offers.companyBio')}</DetailsTitle>
                    </ColStyle>
                    <ColStyle>
                      <DetailsValue>{offerData?.selectedCompanies?.company?.bio}</DetailsValue>
                    </ColStyle>
                  </DetailsRow>

                  <DetailsRow>
                    <ColStyle>
                      <DetailsTitle>{t('offers.companyAddress')}</DetailsTitle>
                    </ColStyle>
                    <ColStyle>
                      <DetailsValue>{offerData?.selectedCompanies?.company?.address}</DetailsValue>
                    </ColStyle>
                  </DetailsRow>
                </>
              )}

              {offerData?.selectedCompanies?.companyBranch?.name && (
                <>
                  <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                    {t('offers.selectedBranch')} :
                  </h3>

                  <DetailsRow>
                    <ColStyle>
                      <DetailsTitle>{t('offers.branchName')}</DetailsTitle>
                    </ColStyle>
                    <ColStyle>
                      <DetailsValue>{offerData?.selectedCompanies?.companyBranch?.name}</DetailsValue>
                    </ColStyle>
                  </DetailsRow>

                  <DetailsRow>
                    <ColStyle>
                      <DetailsTitle>{t('offers.branchBio')}</DetailsTitle>
                    </ColStyle>
                    <ColStyle>
                      <DetailsValue>{offerData?.selectedCompanies?.companyBranch?.bio}</DetailsValue>
                    </ColStyle>
                  </DetailsRow>

                  <DetailsRow>
                    <ColStyle>
                      <DetailsTitle>{t('offers.branchAddress')}</DetailsTitle>
                    </ColStyle>
                    <ColStyle>
                      <DetailsValue>{offerData?.selectedCompanies?.companyBranch?.address}</DetailsValue>
                    </ColStyle>
                  </DetailsRow>
                </>
              )}

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('offers.userInfo')} :
              </h3>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('offers.fullName')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {offerData?.selectedCompanies?.requestForQuotation?.user?.fullName == ' '
                    ? '___'
                    : offerData?.selectedCompanies?.requestForQuotation?.user?.fullName}
                </DetailsValue>
              </DetailsRow>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('offers.userName')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {offerData?.selectedCompanies?.requestForQuotation?.user?.userName}
                </DetailsValue>
              </DetailsRow>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('offers.emailAddress')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {offerData?.selectedCompanies?.requestForQuotation?.user?.emailAddress}
                </DetailsValue>
              </DetailsRow>
            </Details>
          </Spinner>
        </Cardd>
      </Row>
    </>
  );
};

export default OfferDetails;
