import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Row, Tree, Image } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { getBranch } from '@app/services/branches';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { DataNode } from 'antd/es/tree';

export type specifierType = {
  name: string;
  value: number | undefined;
};

export type branchData = {
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

const BranchDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { branchId } = useParams();
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();

  const [loading, setLoading] = useState(true);
  const [branchData, setBranchData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const { refetch, isRefetching } = useQuery(['getBranch'], () =>
    getBranch(branchId)
      .then((data) => {
        const result = data.data?.result;
        setBranchData(result);
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

  if (branchData && branchData?.services) {
    treeData = branchData?.services.map((service: any) => ({
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={16} height={16} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: service?.id,
      children: service?.subServices.map((subService: any) => ({
        title: (
          <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
            <Image src={subService?.attachment?.url} width={16} height={16} />
            {subService?.name}
          </span>
        ),
        key: subService?.id,
        children: subService?.tools.map((tool: any) => ({
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              <Image src={tool?.attachment?.url} width={16} height={16} />
              {tool?.name}
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
      <PageTitle>{t('branch.branchInfo')}</PageTitle>
      <Row>
        <Cardd
          title={t('branch.branchInfo')}
          padding="0 1.25rem 1rem 1.25rem"
          style={{ width: '100%', height: 'auto' }}
        >
          <Spinner spinning={loading}>
            <Details>
              <h3 style={{ paddingTop: '2rem', margin: '0 2% 1rem' }}>{t('branch.branchProfile')} :</h3>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.name')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.address')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.address}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.bio')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.bio}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.country')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.region?.city?.country?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.city')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.region?.city?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.region')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.region?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.availableCities')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  {branchData?.availableCities.length > 0
                    ? branchData?.availableCities.map((city: any) => (
                        <DetailsValue key={city?.id}>{city?.name + ' / ' + city?.country?.name}</DetailsValue>
                      ))
                    : '___'}
                </ColStyle>
              </DetailsRow>

              {/* <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.numberOfTransfers')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.numberOfTransfers}</DetailsValue>
                </ColStyle>
              </DetailsRow> */}

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.companyContact')} :
              </h3>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.phoneNumber')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {branchData?.companyContact?.dialCode + ' ' + branchData?.companyContact?.phoneNumber}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.emailAddress')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.companyContact?.emailAddress}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.webSite')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.companyContact?.webSite}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.companyUser')} :
              </h3>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.fullName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.user?.fullName == ' ' ? branchData?.user?.fullName : '___'}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.emailAddress')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.user?.emailAddress}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.phoneNumber')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.user?.phoneNumber}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.userName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.user?.userName}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.creationTime')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.user?.creationTime}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.services')} :
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

export default BranchDetails;
