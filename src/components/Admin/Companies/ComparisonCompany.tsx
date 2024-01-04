import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Row, Tree, Image, Tag, Space, Progress, Avatar, Segmented, Tooltip, Layout, Col, Input } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { GetCompaniesToCompare } from '@app/services/companies';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { DataNode } from 'antd/es/tree';
import { Button } from '@app/components/common/buttons/Button/Button';
import {
  CheckOutlined,
  CloseOutlined,
  CommentOutlined,
  DollarOutlined,
  DropboxOutlined,
  GiftOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { LableText, TableButton, TextBack } from '@app/components/GeneralStyles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';

export type specifierType = {
  name: string;
  value: number | undefined;
};

// export type companyData = {
//   companyCode: string;
//   id: number;
// };

// const treeStyle = {
//   width: '96%',
//   margin: '0 2%',
//   padding: '0.5rem',
//   borderRadius: '0.25rem',
//   border: '1px solid #d9d9d9',
//   backgroundColor: '#fff',
// };

// let treeData: DataNode[] = [];

const ComparisonCompany: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { companyId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const [form] = BaseForm.useForm();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [oldCompanyData, setOldCompanyData] = useState<any>();
  const [newCompanyData, setNewCompanyData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const { refetch, isRefetching } = useQuery(['GetCompaniesToCompare'], () =>
    GetCompaniesToCompare(companyId)
      .then((data) => {
        const result = data.data?.result;
        setOldCompanyData(result.oldCompany);
        setNewCompanyData(result.newCompany);
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

  //   if (companyData && companyData?.services) {
  //     treeData = companyData?.services.map((service: any) => ({
  //       title: (
  //         <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
  //           <Image src={service?.attachment?.url} width={27} height={27} />
  //           <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
  //         </span>
  //       ),
  //       key: service?.id,
  //       children: service?.subServices.map((subService: any) => ({
  //         title: (
  //           <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
  //             <Image src={subService?.attachment?.url} width={27} height={27} />
  //             {subService?.name}
  //           </span>
  //         ),
  //         key: subService?.id,
  //         children: subService?.tools.map((tool: any) => ({
  //           title: (
  //             <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
  //               <Image src={tool?.attachment?.url} width={27} height={27} />
  //               {tool?.name}
  //             </span>
  //           ),
  //           key: tool?.id,
  //         })),
  //       })),
  //     }));
  //   }

  //   const DetailsRow = styled.div`
  //     display: flex;
  //     justify-content: flex-start;
  //   `;

  //   const DetailsTitle = styled.div`
  //     color: var(--text-light-color);
  //     font-size: ${FONT_SIZE.lg};
  //     font-weight: ${FONT_WEIGHT.semibold};
  //     margin-right: 0.5rem;
  //     width: 100%;
  //   `;

  //   const DetailsValue = styled.div`
  //     color: var(--text-main-color);
  //     font-size: ${FONT_SIZE.md};
  //     font-weight: ${FONT_WEIGHT.medium};
  //     margin-bottom: 1rem;
  //   `;

  //   const ColStyle =
  //     isDesktop || isTablet
  //       ? styled.div`
  //           width: 46%;
  //           margin: 0 2%;
  //         `
  //       : styled.div`
  //           width: 80%;
  //           margin: 0 10%;
  //         `;

  //   const Details = styled.div`
  //     display: flex;
  //     flex-direction: column;
  //     gap: 1.25rem;
  //     margin: 1.25rem 0.5rem;
  //   `;

  //   const conicPinkColors = { '0%': '#ffba6f', '50%': '#ff6f61', '100%': '#ff4369' };
  //   const conicGreenColors = { '0%': '#f6ff00', '50%': '#b3ff00', '100%': '#73d13d' };
  //   const conicBlueColors = { '0%': '#a6dcef', '50%': '#2e93e5', '100%': '#0050b3' };
  //   const conicRedColors = { '0%': '#ffbb96', '50%': '#ff6b45', '100%': '#e62b1d' };

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
      <PageTitle>{t('companies.companyInfo')}</PageTitle>
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
        <Col style={{ width: '40%', margin: 'auto 5%' }}>
          <Cardd
            title={t('companies.oldCompany')}
            padding="0 1.25rem 1rem 1.25rem"
            style={{ width: '100%', height: 'auto', display: 'inline-block' }}
          >
            <Spinner spinning={loading}>
              <BaseForm form={form} name="OldCompanyForm">
                <BaseForm.Item label={<LableText>{t('common.name')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.name}
                    readOnly
                    status={oldCompanyData?.name != newCompanyData?.name ? 'error' : ''}
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.bio')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.bio}
                    readOnly
                    status={oldCompanyData?.bio != newCompanyData?.bio ? 'error' : ''}
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.address')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.address}
                    readOnly
                    status={oldCompanyData?.address != newCompanyData?.address ? 'error' : ''}
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.country')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.region?.city?.country?.name}
                    readOnly
                    status={
                      oldCompanyData?.region?.city?.country?.name != newCompanyData?.region?.city?.country?.name
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.city')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.region?.city?.name}
                    readOnly
                    status={oldCompanyData?.region?.city?.name != newCompanyData?.region?.city?.name ? 'error' : ''}
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.region')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.region?.name}
                    readOnly
                    status={oldCompanyData?.region?.name != newCompanyData?.region?.name ? 'error' : ''}
                  />
                </BaseForm.Item>
                <BaseForm.Item
                  label={<LableText>{t('companies.availableCities')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  {oldCompanyData?.availableCities.map((newCity: any) => {
                    const isCityInOldCompany = newCompanyData?.availableCities.some(
                      (oldCity: any) => oldCity.id === newCity.id,
                    );

                    const tagColor = isCityInOldCompany ? '' : 'error';

                    return (
                      <Tag key={newCity.id} color={tagColor}>
                        {newCity.name}
                      </Tag>
                    );
                  })}
                </BaseForm.Item>
              </BaseForm>
            </Spinner>
          </Cardd>
        </Col>

        <Col style={{ width: '40%', margin: 'auto 5%' }}>
          <Cardd
            title={t('companies.newCompany')}
            padding="0 1.25rem 1rem 1.25rem"
            style={{ width: '100%', height: 'auto', display: 'inline-block' }}
          >
            <Spinner spinning={loading}>
              <BaseForm form={form} name="NewCompanyForm">
                <BaseForm.Item label={<LableText>{t('common.name')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.name}
                    readOnly
                    style={
                      oldCompanyData?.name != newCompanyData?.name ? { borderColor: 'var(--ant-success-color)' } : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.bio')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.bio}
                    readOnly
                    style={
                      oldCompanyData?.bio != newCompanyData?.bio ? { borderColor: 'var(--ant-success-color)' } : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.address')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.address}
                    readOnly
                    style={
                      oldCompanyData?.address != newCompanyData?.address
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.country')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.region?.city?.country?.name}
                    readOnly
                    style={
                      oldCompanyData?.region?.city?.country?.name != newCompanyData?.region?.city?.country?.name
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.city')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.region?.city?.name}
                    readOnly
                    style={
                      oldCompanyData?.region?.city?.name != newCompanyData?.region?.city?.name
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.region')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.region?.name}
                    readOnly
                    style={
                      oldCompanyData?.region?.name != newCompanyData?.region?.name
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item
                  label={<LableText>{t('companies.availableCities')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  {newCompanyData?.availableCities.map((newCity: any) => {
                    const isCityInOldCompany = oldCompanyData?.availableCities.some(
                      (oldCity: any) => oldCity.id === newCity.id,
                    );

                    const tagColor = isCityInOldCompany ? '' : 'success';

                    return (
                      <Tag key={newCity.id} color={tagColor}>
                        {newCity.name}
                      </Tag>
                    );
                  })}
                </BaseForm.Item>
              </BaseForm>
            </Spinner>
          </Cardd>
        </Col>
      </Row>
    </>
  );
};

export default ComparisonCompany;
