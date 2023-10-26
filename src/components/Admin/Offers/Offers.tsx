import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Space, message } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import Button from 'antd/es/button/button';
import { Button as ButtonCol } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { getAllOffers, sendForUser } from '@app/services/offers';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { RequestModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import Tag from 'antd/es/tag';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined } from '@ant-design/icons';
import { TextBack } from '@app/components/GeneralStyles';

export const Offers: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();
  const { requestId, companyId, branchId } = useParams();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<RequestModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  const { refetch, isRefetching } = useQuery(
    ['Offers', page, pageSize],
    () =>
      getAllOffers(
        page,
        pageSize,
        searchString,
        requestId != undefined ? requestId : '',
        companyId != undefined ? companyId : '',
        branchId != undefined ? branchId : '',
      )
        .then((data) => {
          const result = data.data?.result?.items;
          setDataSource(result);
          setTotalCount(data.data.result?.totalCount);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataSource === undefined,
    },
  );

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [page, pageSize, language, searchString, refetch]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const sendForUserMutation = useMutation((data: string[]) =>
    sendForUser(data)
      .then((res) => {
        res.data?.success &&
          message.open({
            content: <Alert message={t('offers.sendToUserSuccessMessage')} type={`success`} showIcon />,
          });
        Navigate('/requests', { replace: false });
      })
      .catch((error) =>
        message.open({ content: <Alert message={error.message || error.error?.message} type={`error`} showIcon /> }),
      ),
  );

  const handleCheckboxChangeForSendToUser = (id: string) => {
    if (selectedOffers.includes(id)) {
      setSelectedOffers(selectedOffers.filter((item) => item !== id));
    } else {
      setSelectedOffers([...selectedOffers, id]);
    }
  };

  const columns = [
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.selected')}</Header>,
      dataIndex: 'id',
      render: (id: any) => (
        <Checkbox onChange={() => handleCheckboxChangeForSendToUser(id)} checked={selectedOffers.includes(id)} />
      ),
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('offers.price')}</Header>, dataIndex: 'price' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('offers.provider')}</Header>,
      dataIndex: 'provider',
      render: (index: number, record: any) => {
        return (
          <>
            {record.provider === 1 && (
              <Tag key={record?.id} color="#01509a" style={{ padding: '4px' }}>
                {t('offers.company')}
              </Tag>
            )}
            {record.provider === 2 && (
              <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
                {t('offers.branch')}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.details')}</Header>,
      dataIndex: 'details',
      render: (index: number, record: any) => {
        return (
          <Space>
            <ButtonCol
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                Navigate(`${record.id}/details`, { state: record.name });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('requests.details')}
              </div>
            </ButtonCol>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('offers.offersList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
        style={{ height: 'auto', marginBottom: '70px' }}
      >
        <Row justify={'end'}>
          <Btn
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
          </Btn>
        </Row>
        <Table
          pagination={{
            showSizeChanger: true,
            onChange: (page: number, pageSize: number) => {
              setPage(page);
              setPageSize(pageSize);
            },
            current: page,
            pageSize: pageSize,
            showQuickJumper: true,
            responsive: true,
            showTitle: false,
            showLessItems: true,
            total: totalCount || 0,
            hideOnSinglePage: true,
          }}
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          loading={loading}
          dataSource={dataSource}
          scroll={{ x: isTablet || isMobile ? 950 : 800 }}
        />
      </Card>

      <Button
        type="primary"
        style={{
          marginBottom: '.5rem',
          width: 'auto',
          height: 'auto',
        }}
        onClick={() => sendForUserMutation.mutateAsync(selectedOffers)}
      >
        <CreateButtonText>{t('common.done')}</CreateButtonText>
      </Button>
    </>
  );
};
