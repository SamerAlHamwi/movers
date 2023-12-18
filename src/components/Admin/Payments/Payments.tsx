import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Tabs } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { useQuery } from 'react-query';
import { getAllPayments } from '@app/services/payments';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { notificationController } from '@app/controllers/notificationController';
import { Header } from '../../GeneralStyles';
import { Payment } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { PaidProvider, PaidStatues, ReasonOfPaid } from '@app/constants/enums/payments';

export const Payments: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();
  const typeOfProvider = [`${t('common.user')}`, `${t('common.company')}`, `${t('common.branch')}`];

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<Payment[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [temp, setTemp] = useState<any>();
  const [bundleStatus, setBundleStatus] = useState<boolean | undefined>(undefined);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [paidProvider, setPaidProvider] = useState<number>(1);
  const [paidStatues, setPaidStatues] = useState<number>(1);
  const [reasonOfPaid, setReasonOfPaid] = useState<number>(1);

  const { refetch, isRefetching } = useQuery(
    ['Points', page, pageSize, bundleStatus],
    () =>
      getAllPayments(page, pageSize, searchString, paidProvider, paidStatues, reasonOfPaid)
        .then((data) => {
          const result: Payment[] = data.data?.result?.items;
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
  }, [page, pageSize, language, searchString, bundleStatus, refetchData, paidProvider]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>,
      render: (record: any) => {
        switch (record.paidProvider) {
          case PaidProvider.user:
            return <>{record?.user.name}</>;
          case PaidProvider.company:
            return <>{record?.company.name}</>;
          case PaidProvider.branch:
            return <>{record?.companyBranch.name}</>;
          default:
            return '';
        }
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('payments.amount')}</Header>,
      dataIndex: 'amount',
      render: (amount: Payment) => {
        return <>{amount}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('payments.paidStatues')}</Header>,
      dataIndex: 'paidStatues',
      render: (paidStatues: PaidStatues) => {
        switch (paidStatues) {
          case PaidStatues.Finish:
            return t('payments.finished');
          default:
            return '';
        }
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('payments.reasonOfPaid')}</Header>,
      dataIndex: 'reasonOfPaid',
      render: (reasonOfPaid: ReasonOfPaid) => {
        switch (reasonOfPaid) {
          case ReasonOfPaid.PayForOffer:
            return t('payments.PayForOffer');
          case ReasonOfPaid.BuyBundle:
            return t('payments.BuyBundle');
          case ReasonOfPaid.BuyFeatureBundle:
            return t('payments.BuyFeatureBundle');
          default:
            return '';
        }
      },
    },
  ];

  const onChange = (key: string) => {
    setPaidProvider(+key);
  };

  return (
    <>
      <Card
        title={t('payments.paymentsList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row justify={'end'}>
          <ReloadBtn setRefetchData={setRefetchData} />
        </Row>

        <Tabs
          onChange={onChange}
          type="card"
          items={typeOfProvider.map((_, i) => {
            const id = String(i + 1);
            return {
              label: `${typeOfProvider[i]}`,
              key: id,
              children: (
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
                    hideOnSinglePage: false,
                  }}
                  columns={columns.map((col) => ({ ...col, width: 'auto' }))}
                  loading={loading}
                  dataSource={dataSource}
                  scroll={{ x: isTablet || isMobile ? 950 : 800 }}
                />
              ),
            };
          })}
        />
      </Card>
    </>
  );
};
