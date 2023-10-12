import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Col, Row, Tree, Card, Image, Tag } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { getRequestById } from '@app/services/requests';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { TableButton } from '@app/components/GeneralStyles';
import { DataNode } from 'antd/es/tree';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Meta } = Card;

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
let attributeChoiceAndAttachmentsData: any[] = [];
const attributeChoiceAttachments: any[] = [];

const RequestDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { requestId } = useParams();
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const { refetch, isRefetching } = useQuery(['getRequestById'], () =>
    getRequestById(requestId)
      .then((data) => {
        const result = data.data?.result;
        setRequestData(result);
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

  if (requestData && requestData?.services) {
    treeData = requestData?.services.map((service: any) => ({
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

  if (requestData && requestData?.attributeChoiceAndAttachments) {
    attributeChoiceAndAttachmentsData = requestData?.attributeChoiceAndAttachments.map(
      (attributeChoiceAndAttachmentsValue: any) => {
        attributeChoiceAndAttachmentsValue?.attachments.map((attachment: any) => {
          if (!attributeChoiceAttachments.includes(attachment)) {
            attributeChoiceAttachments.push(attachment);
          }
        });
      },
    );
  }

  return (
    <>
      <PageTitle>{t('requests.requestInfo')}</PageTitle>
      <Row>
        <Cardd
          title={t('requests.requestInfo')}
          padding="0 1.25rem 1rem 1.25rem"
          style={{ width: '100%', height: 'auto' }}
        >
          <Spinner spinning={loading}>
            <Row style={{ margin: '2rem 0' }}>
              <ColStyle>
                <h3> {t('requests.source')} :</h3>
              </ColStyle>
              <ColStyle>
                <h3> {t('requests.destination')} :</h3>
              </ColStyle>
            </Row>

            <Details>
              <DetailsRow>
                {requestData?.requestForQuotationContacts.map((request: any) => {
                  return (
                    <>
                      {request?.requestForQuotationContactType == '1' && (
                        <ColStyle>
                          <DetailsTitle>{t('common.name')}</DetailsTitle>
                          <DetailsValue>{request?.fullName}</DetailsValue>
                        </ColStyle>
                      )}
                      {request?.requestForQuotationContactType == '2' && (
                        <ColStyle>
                          <DetailsTitle>{t('common.name')}</DetailsTitle>
                          <DetailsValue>{request?.fullName}</DetailsValue>
                        </ColStyle>
                      )}
                    </>
                  );
                })}
              </DetailsRow>

              <DetailsRow>
                {requestData?.requestForQuotationContacts.map((request: any) => {
                  return (
                    <>
                      {request?.requestForQuotationContactType == '1' && (
                        <ColStyle>
                          <DetailsTitle>{t('common.phoneNumber')}</DetailsTitle>
                          <DetailsValue>{request?.dailCode + '  ' + request?.phoneNumber}</DetailsValue>
                        </ColStyle>
                      )}
                      {request?.requestForQuotationContactType == '2' && (
                        <ColStyle>
                          <DetailsTitle>{t('common.phoneNumber')}</DetailsTitle>
                          <DetailsValue>{request?.dailCode + '  ' + request?.phoneNumber}</DetailsValue>
                        </ColStyle>
                      )}
                    </>
                  );
                })}
              </DetailsRow>

              <DetailsRow>
                {requestData?.requestForQuotationContacts.map((request: any) => {
                  return (
                    <>
                      {request?.requestForQuotationContactType == '1' && (
                        <ColStyle>
                          <DetailsTitle>{t('requests.isCallAvailable')}</DetailsTitle>
                          <DetailsValue style={{ padding: '0.5rem' }}>
                            {request?.isCallAvailable === true ? (
                              <TableButton severity="info">
                                <CheckOutlined />
                              </TableButton>
                            ) : (
                              <TableButton severity="error">
                                <CloseOutlined />
                              </TableButton>
                            )}
                          </DetailsValue>
                        </ColStyle>
                      )}
                      {request?.requestForQuotationContactType == '2' && (
                        <ColStyle>
                          <DetailsTitle>{t('requests.isCallAvailable')}</DetailsTitle>
                          <DetailsValue style={{ padding: '0.5rem' }}>
                            {request?.isCallAvailable === true ? (
                              <TableButton severity="info">
                                <CheckOutlined />
                              </TableButton>
                            ) : (
                              <TableButton severity="error">
                                <CloseOutlined />
                              </TableButton>
                            )}
                          </DetailsValue>
                        </ColStyle>
                      )}
                    </>
                  );
                })}
              </DetailsRow>

              <DetailsRow>
                {requestData?.requestForQuotationContacts.map((request: any) => {
                  return (
                    <>
                      {request?.requestForQuotationContactType == '1' && (
                        <ColStyle>
                          <DetailsTitle>{t('requests.isTelegramAvailable')}</DetailsTitle>
                          <DetailsValue style={{ padding: '0.5rem' }}>
                            {request?.isTelegramAvailable === true ? (
                              <TableButton severity="info">
                                <CheckOutlined />
                              </TableButton>
                            ) : (
                              <TableButton severity="error">
                                <CloseOutlined />
                              </TableButton>
                            )}
                          </DetailsValue>
                        </ColStyle>
                      )}
                      {request?.requestForQuotationContactType == '2' && (
                        <ColStyle>
                          <DetailsTitle>{t('requests.isTelegramAvailable')}</DetailsTitle>
                          <DetailsValue style={{ padding: '0.5rem' }}>
                            {request?.isTelegramAvailable === true ? (
                              <TableButton severity="info">
                                <CheckOutlined />
                              </TableButton>
                            ) : (
                              <TableButton severity="error">
                                <CloseOutlined />
                              </TableButton>
                            )}
                          </DetailsValue>
                        </ColStyle>
                      )}
                    </>
                  );
                })}
              </DetailsRow>

              <DetailsRow>
                {requestData?.requestForQuotationContacts.map((request: any) => {
                  return (
                    <>
                      {request?.requestForQuotationContactType == '1' && (
                        <ColStyle>
                          <DetailsTitle>{t('requests.isWhatsAppAvailable')}</DetailsTitle>
                          <DetailsValue style={{ padding: '0.5rem' }}>
                            {request?.isWhatsAppAvailable === true ? (
                              <TableButton severity="info">
                                <CheckOutlined />
                              </TableButton>
                            ) : (
                              <TableButton severity="error">
                                <CloseOutlined />
                              </TableButton>
                            )}
                          </DetailsValue>
                        </ColStyle>
                      )}
                      {request?.requestForQuotationContactType == '2' && (
                        <ColStyle>
                          <DetailsTitle>{t('requests.isWhatsAppAvailable')}</DetailsTitle>
                          <DetailsValue style={{ padding: '0.5rem' }}>
                            {request?.isWhatsAppAvailable === true ? (
                              <TableButton severity="info">
                                <CheckOutlined />
                              </TableButton>
                            ) : (
                              <TableButton severity="error">
                                <CloseOutlined />
                              </TableButton>
                            )}
                          </DetailsValue>
                        </ColStyle>
                      )}
                    </>
                  );
                })}
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle> {t('requests.country')} </DetailsTitle>
                  <DetailsValue>{requestData?.sourceCity?.country?.name}</DetailsValue>
                </ColStyle>
                <ColStyle>
                  <DetailsTitle> {t('requests.country')} </DetailsTitle>
                  <DetailsValue>{requestData?.destinationCity?.country?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle> {t('requests.city')} </DetailsTitle>
                  <DetailsValue>{requestData?.sourceCity?.name}</DetailsValue>
                </ColStyle>
                <ColStyle>
                  <DetailsTitle> {t('requests.city')} </DetailsTitle>
                  <DetailsValue>{requestData?.destinationCity?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle> {t('requests.address')} </DetailsTitle>
                  <DetailsValue>{requestData?.sourceAddress}</DetailsValue>
                </ColStyle>
                <ColStyle>
                  <DetailsTitle> {t('requests.address')} </DetailsTitle>
                  <DetailsValue>{requestData?.destinationAddress}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle> {t('requests.moveAtUtc')} </DetailsTitle>
                  <DetailsValue>{requestData?.moveAtUtc} </DetailsValue>
                </ColStyle>
                <ColStyle>
                  <DetailsTitle> {t('requests.arrivalAtUtc')} </DetailsTitle>
                  <DetailsValue>{requestData?.arrivalAtUtc}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              {treeData.length > 0 ? (
                <>
                  <DetailsTitle style={{ margin: '0 2%' }}>{t('requests.services')}</DetailsTitle>
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
                    {t('requests.services')}
                  </DetailsTitle>
                  <DetailsValue
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    ___
                  </DetailsValue>
                </DetailsRow>
              )}

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('requests.additionalInfo')} :
              </h3>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.comment')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.comment == null ? t('requests.nocomment') : requestData?.comment}
                </DetailsValue>
              </DetailsRow>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.creationTime')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.creationTime}
                </DetailsValue>
              </DetailsRow>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.lastModificationTime')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.lastModificationTime == null ? '___' : requestData?.lastModificationTime}
                </DetailsValue>
              </DetailsRow>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.userCreator')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.user?.fullName == ' ' ? '___' : requestData?.user?.fullName}
                </DetailsValue>
              </DetailsRow>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.userType')}
                </DetailsTitle>

                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.user?.type === 1
                    ? 'Admin'
                    : requestData?.user?.type === 2
                    ? 'BasicUser'
                    : requestData?.user?.type === 3
                    ? 'CompanyUser'
                    : requestData?.user?.type === 4
                    ? 'CustomerService'
                    : 'CompanyBranchUser'}
                </DetailsValue>
              </DetailsRow>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.statues')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.statues === 1 ? (
                    <Tag color="#30af5b" style={{ padding: '4px' }}>
                      {t('requests.checking')}
                    </Tag>
                  ) : requestData?.statues === 2 ? (
                    <Tag color="#01509a" style={{ padding: '4px' }}>
                      {t('requests.approved')}
                    </Tag>
                  ) : requestData?.statues === 3 ? (
                    <Tag color="#ff5252" style={{ padding: '4px' }}>
                      {t('requests.rejected')}
                    </Tag>
                  ) : (
                    '_'
                  )}
                </DetailsValue>
              </DetailsRow>

              <DetailsTitle style={{ margin: '0 2%' }}>{t('requests.sourceType')}</DetailsTitle>
              <Card style={{ width: '100%', margin: '1rem 0' }}>
                <Meta
                  avatar={<Image src={requestData?.sourceType?.attachment?.url} />}
                  title={requestData?.sourceType?.name}
                  description={requestData?.attributeForSourceTypeValues.map((attributeForSourceTypeValue: any) => (
                    <Col
                      key={attributeForSourceTypeValue?.attributeForSourcType?.id}
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      <h6>{attributeForSourceTypeValue?.attributeForSourcType?.name}</h6>
                      <p>{attributeForSourceTypeValue?.attributeChoice?.name}</p>
                    </Col>
                  ))}
                />
              </Card>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('requests.attachments')} :
              </h3>

              {requestData?.attributeChoiceAndAttachments.map((attributeChoiceAndAttachmentsValue: any) => (
                <Col key={attributeChoiceAndAttachmentsValue?.attributeChoice?.id}>
                  <h4 style={{ margin: '0 2% 1rem' }}>{attributeChoiceAndAttachmentsValue?.attributeChoice?.name} :</h4>
                  {attributeChoiceAndAttachmentsValue?.attachments.map((attachment: any) => (
                    <Image key={attachment?.id} src={attachment?.url} style={{ width: '150px' }} />
                  ))}
                </Col>
              ))}

              <Row>
                {requestData?.attachments.map((attachment: any) => (
                  <Image key={attachment?.id} src={attachment?.url} style={{ width: '150px' }} />
                ))}
              </Row>
            </Details>
          </Spinner>
        </Cardd>
      </Row>
    </>
  );
};

export default RequestDetails;
