import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Row, message } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { UpdateContactUs } from '@app/services/contactUs';
import { getRequestById } from '@app/services/requests';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button } from '@app/components/common/buttons/Button/Button';
import { EditOutlined } from '@ant-design/icons';
import { EditContactUs } from '@app/components/modal/EditContactUs';
import { CreateButtonText } from '../../GeneralStyles';

export type specifierType = {
  name: string;
  value: number | undefined;
};

export type companyData = {
  companyCode: string;
  id: number;
};

const RequestDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactData, setContacData] = useState<any>();
  const [isOpenEditModalForm, setIsOpenEditModalForm] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<any | undefined>(undefined);

  const { refetch, isRefetching } = useQuery(['getContactUs'], () =>
    getRequestById(17)
      .then((data) => {
        const result = data.data?.result;
        setContacData(result);
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
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.semibold};
    margin-right: 0.5rem;
    width: 25%;
  `;

  const DetailsValue = styled.div`
    color: var(--text-main-color);
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.medium};
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
    setIsEdit(false);
  }, [isEdit, refetch, language]);

  const editContactInfo = useMutation((data: any) => UpdateContactUs(data));

  const handleEdit = (data: any) => {
    editContactInfo
      .mutateAsync({ ...data })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`contactUs.editContactSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setIsOpenEditModalForm(editContactInfo.isLoading);
  }, [editContactInfo.isLoading]);

  return (
    <>
      <PageTitle>{t('contactUs.contactUsInfo')}</PageTitle>
      <Row>
        <Card
          title={t('contactUs.contactUsInfo')}
          padding="0 1.25rem 1rem 1.25rem"
          style={{ width: '100%', height: 'auto' }}
        >
          <Spinner spinning={loading}>
            <Details>
              <DetailsRow key={1}>
                <DetailsTitle>{t('common.name')}</DetailsTitle>
                <DetailsValue>{contactData?.name}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={2}>
                <DetailsTitle> {t('common.address')} </DetailsTitle>
                <DetailsValue>{contactData?.address}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={3}>
                <DetailsTitle> {t('common.description')} </DetailsTitle>
                <DetailsValue>{contactData?.description}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={4}>
                <DetailsTitle> {t('contactUs.emailAddress')} </DetailsTitle>
                <DetailsValue>{contactData?.emailAddress}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={5}>
                <DetailsTitle> {t('contactUs.phoneNumber')} </DetailsTitle>
                <DetailsValue>{contactData?.phoneNumber}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={6}>
                <DetailsTitle> {t('contactUs.facebook')} </DetailsTitle>
                <DetailsValue>{contactData?.facebook}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={7}>
                <DetailsTitle> {t('contactUs.instgram')} </DetailsTitle>
                <DetailsValue>{contactData?.instgram}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={8}>
                <DetailsTitle> {t('contactUs.twitter')} </DetailsTitle>
                <DetailsValue>{contactData?.twitter}</DetailsValue>
              </DetailsRow>
            </Details>
          </Spinner>
        </Card>

        <Button
          type="primary"
          style={{
            margin: '1rem 1rem 1rem 0',
            width: 'auto',
            height: 'auto',
          }}
          onClick={() => {
            setIsOpenEditModalForm(true);
            setEditmodaldata(contactData);
          }}
          icon={<EditOutlined />}
        >
          <CreateButtonText>{t('common.edit')}</CreateButtonText>
        </Button>
      </Row>

      {isOpenEditModalForm && (
        <EditContactUs
          contact_values={editmodaldata}
          visible={isOpenEditModalForm}
          onCancel={() => setIsOpenEditModalForm(false)}
          onEdit={(data: any) => {
            const id = editmodaldata.id;
            const values = { ...data, id };
            editmodaldata !== undefined && handleEdit(values);
          }}
          isLoading={editContactInfo.isLoading}
        />
      )}
    </>
  );
};

export default RequestDetails;
