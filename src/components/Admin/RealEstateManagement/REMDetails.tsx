import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Row, Card, Tooltip, message, Alert } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { getPartner, DeleteCode, DeleteNumber } from '@app/services/partners';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { Button } from '@app/components/common/buttons/Button/Button';
import { DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import { TableButton, TextBack } from '@app/components/GeneralStyles';
import { Partner } from '@app/interfaces/interfaces';
import { ActionModal } from '@app/components/modal/ActionModal';

export type specifierType = {
  name: string;
  value: number | undefined;
};

export type partnerData = {
  companyCode: string;
  id: number;
};

const gridStyle: React.CSSProperties = {
  width: '25%',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
};

const REMDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { partnerId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const Navigate = useNavigate();

  const [modalState, setModalState] = useState({
    deleteCode: false,
    deleteNumber: false,
  });
  const [loading, setLoading] = useState(true);
  const [partnerData, setCompanyData] = useState<any>();
  const [deleteCodemodaldata, setDeleteCodemodaldata] = useState<Partner | undefined>(undefined);
  const [deleteNumbermodaldata, setDeleteNumbermodaldata] = useState<Partner | undefined>(undefined);
  const [isDeleteCode, setIsDeleteCode] = useState(false);
  const [isDeleteNumber, setIsDeleteNumber] = useState(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

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

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsDeleteCode(false);
    setIsDeleteNumber(false);
  }, [isDeleteCode, isDeleteNumber, refetch]);

  const deleteCode = useMutation((id: number) =>
    DeleteCode(id)
      .then((data) => {
        data.data?.success &&
          (setIsDeleteCode(data.data?.success),
          message.open({
            content: <Alert message={t('partners.deleteCodeSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleDeleteCode = (id: any) => {
    deleteCode.mutateAsync(id);
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, deleteCode: deleteCode.isLoading }));
  }, [deleteCode.isLoading]);

  const deleteNumber = useMutation((id: number) =>
    DeleteNumber(id)
      .then((data) => {
        data.data?.success &&
          (setIsDeleteNumber(data.data?.success),
          message.open({
            content: <Alert message={t('partners.deleteNumberSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleDeleteNumber = (id: any) => {
    deleteNumber.mutateAsync(id);
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, deleteNumber: deleteNumber.isLoading }));
  }, [deleteNumber.isLoading]);

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

        {/*    Delete Code    */}
        {modalState.deleteCode && (
          <ActionModal
            visible={modalState.deleteCode}
            onCancel={() => handleModalClose('deleteCode')}
            onOK={() => {
              deleteCodemodaldata !== undefined && handleDeleteCode(deleteCodemodaldata);
            }}
            width={isDesktop || isTablet ? '450px' : '350px'}
            title={t('partners.deleteCodeModalTitle')}
            okText={t('common.delete')}
            cancelText={t('common.cancel')}
            isDanger={true}
            description={t('partners.deleteCodeModalDescription')}
            isLoading={deleteCode.isLoading}
          />
        )}

        {/*    Delete Number    */}
        {modalState.deleteNumber && (
          <ActionModal
            visible={modalState.deleteNumber}
            onCancel={() => handleModalClose('deleteNumber')}
            onOK={() => {
              deleteNumbermodaldata !== undefined && handleDeleteNumber(deleteNumbermodaldata);
            }}
            width={isDesktop || isTablet ? '450px' : '350px'}
            title={t('partners.deleteNumberModalTitle')}
            okText={t('common.delete')}
            cancelText={t('common.cancel')}
            isDanger={true}
            description={t('partners.deleteNumberModalDescription')}
            isLoading={deleteNumber.isLoading}
          />
        )}
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

              {partnerData?.codes.length == 0 && <p>{t('partners.thereAreNoCodesForThisPartnerYet')}</p>}

              {partnerData?.codes.map((code: any) => (
                <Card
                  key={code?.id}
                  title={
                    <>
                      <p style={{ color: '#01509a', display: 'inline' }}> {code?.rsmCode} </p>/
                      <p style={{ color: '#30af5b', display: 'inline' }}> {code?.discountPercentage} </p>
                      <p style={{ display: 'inline', fontSize: 'smaller', fontWeight: '500' }}>
                        {code?.codeType == 1 ? '%' : 'AED'}
                      </p>
                    </>
                  }
                  extra={
                    <Tooltip placement="top" title={t('common.delete')}>
                      <TableButton
                        severity="error"
                        onClick={() => {
                          setDeleteCodemodaldata(code?.id);
                          handleModalOpen('deleteCode');
                        }}
                      >
                        <DeleteOutlined />
                      </TableButton>
                    </Tooltip>
                  }
                >
                  {code?.phonesNumbers != null &&
                    code?.phonesNumbers.length > 0 &&
                    code?.phonesNumbers[0] != '' &&
                    code?.phonesNumbers.map((phoneNumber: string) => (
                      <Card.Grid key={phoneNumber} style={gridStyle}>
                        <div>
                          {phoneNumber}
                          <Tooltip placement="top" title={t('common.delete')}>
                            <TableButton
                              severity="error"
                              style={{ display: 'inline-flex', border: 'none', background: 'none' }}
                              onClick={() => {
                                setDeleteNumbermodaldata(code?.id);
                                handleModalOpen('deleteNumber');
                              }}
                            >
                              <DeleteOutlined />
                            </TableButton>
                          </Tooltip>
                        </div>
                      </Card.Grid>
                    ))}
                </Card>
              ))}
            </Details>
          </Spinner>
        </Cardd>
      </Row>
    </>
  );
};

export default REMDetails;
