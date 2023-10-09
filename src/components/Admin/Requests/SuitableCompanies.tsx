import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row, Space } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { EditRequest } from '@app/components/modal/EditRequest';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { getAllRequests, createRequest, DeleteRequest, UpdateRequest, confirmRequest } from '@app/services/requests';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { RequestModel } from '@app/interfaces/interfaces';
import { TableButton, Header, Image, Modal } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import Tag from 'antd/es/tag';
import { useNavigate } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSuitableCompanies } from '@app/services/companies';
import { getSuitableBranches } from '@app/services/branches';
import { Image as AntdImage } from '@app/components/common/Image/Image';

export const SuitableCompanies: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, mobileOnly } = useResponsive();
  const { requestId } = useParams();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
    approve: false,
    reject: false,
  });
  const [pageCompany, setPageCompany] = useState<number>(1);
  const [pageBranch, setPageBranch] = useState<number>(1);
  const [pageSizeCompany, setPageSizeCompany] = useState<number>(DEFAULT_PAGE_SIZE);
  const [pageSizeBranch, setPageSizeBranch] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataCompany, setDataCompany] = useState<RequestModel[] | undefined>(undefined);
  const [dataBranch, setDataBranch] = useState<RequestModel[] | undefined>(undefined);
  const [totalCountCompany, setTotalCountCompany] = useState<number>(0);
  const [totalCountBranch, setTotalCountBranch] = useState<number>(0);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingBranch, setLoadingBranch] = useState(true);
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);
  const [attachmentData, setAttachmentData] = useState<any>();

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch: refetchCompanies, isRefetching: isRefetchingCompanies } = useQuery(
    ['SuitableCompanies', pageCompany, pageSizeCompany],
    () =>
      getSuitableCompanies(pageCompany, pageSizeCompany, searchString, requestId)
        .then((data) => {
          const result = data.data?.result?.items;
          setDataCompany(result);
          setTotalCountCompany(data.data.result?.totalCountCompany);
          setLoadingCompany(!data.data?.success);
        })
        .catch((err) => {
          setLoadingCompany(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataCompany === undefined,
    },
  );

  const { refetch: reetchBranch, isRefetching: isRefetchingBranch } = useQuery(
    ['SuitableBranches', pageBranch, pageSizeBranch],
    () =>
      getSuitableBranches(pageBranch, pageSizeBranch, searchString, requestId)
        .then((data) => {
          const result = data.data?.result?.items;
          setDataBranch(result);
          setTotalCountBranch(data.data.result?.totalCountBranch);
          setLoadingBranch(!data.data?.success);
        })
        .catch((err) => {
          setLoadingBranch(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataBranch === undefined,
    },
  );

  useEffect(() => {
    if (isRefetchingCompanies) setLoadingCompany(true);
    else setLoadingCompany(false);
  }, [isRefetchingCompanies]);

  useEffect(() => {
    if (isRefetchingBranch) setLoadingBranch(true);
    else setLoadingBranch(false);
  }, [isRefetchingBranch]);

  useEffect(() => {
    setLoadingCompany(true);
    refetchCompanies();
  }, [pageCompany, pageSizeCompany, language, searchString, refetchCompanies]);

  useEffect(() => {
    setLoadingBranch(true);
    reetchBranch();
  }, [pageBranch, pageSizeBranch, language, searchString, reetchBranch]);

  useEffect(() => {
    if (pageCompany > 1 && dataCompany?.length === 0) {
      setPageCompany(1);
    }
  }, [pageCompany, dataCompany]);

  useEffect(() => {
    if (pageBranch > 1 && dataBranch?.length === 0) {
      setPageBranch(1);
    }
  }, [pageBranch, dataBranch]);

  const columnsCompany = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header>{t('common.image')}</Header>,
      dataIndex: ['companyProfile', 'url'],
      render: (url: string, record: any) => {
        return (
          <>
            <Image
              src={url}
              onClick={() => {
                setIsOpenSliderImage(true);
                setAttachmentData(record?.companyProfile);
              }}
            />
          </>
        );
      },
    },
    { title: <Header>{t('common.name')}</Header>, dataIndex: 'name' },
    { title: <Header>{t('common.address')}</Header>, dataIndex: 'address' },
    { title: <Header>{t('common.bio')}</Header>, dataIndex: 'bio' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.numberOfTransfers')}</Header>,
      dataIndex: 'numberOfTransfers',
    },
    { title: <Header>{t('branch.region')}</Header>, dataIndex: ['region', 'name'] },
    {
      title: <Header>{t('requests.services')}</Header>,
      dataIndex: 'services',
      render: (record: any) => (
        <Space style={{ display: 'grid' }}>
          {record?.map((service: any) => (
            <Tag key={service?.id}>{service?.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: <Header>{t('companies.status')}</Header>,
      dataIndex: 'status',
      render: (index: number, record: any) => {
        return (
          <>
            {record.statues === 1 && (
              <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
                {t('companies.checking')}
              </Tag>
            )}
            {record.statues === 2 && (
              <Tag key={record?.id} color="#01509a" style={{ padding: '4px' }}>
                {t('companies.approved')}
              </Tag>
            )}
            {record.statues === 3 && (
              <Tag key={record?.id} color="#ff5252" style={{ padding: '4px' }}>
                {t('companies.rejected')}
              </Tag>
            )}
          </>
        );
      },
    },
    // {
    //   title: <Header>{t('common.actions')}</Header>,
    //   dataIndex: 'actions',
    //   render: (index: number, record: RequestModel) => {
    //     return (
    //       <Space>
    //         <TableButton
    //           severity="info"
    //           onClick={() => {
    //             handleModalOpen('edit');
    //           }}
    //         >
    //           <EditOutlined />
    //         </TableButton>
    //       </Space>
    //     );
    //   },
    // },
  ];

  const columnsBranch = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header>{t('common.image')}</Header>,
      dataIndex: ['companyProfile', 'url'],
      render: (url: string, record: any) => {
        return (
          <>
            <Image
              src={url}
              onClick={() => {
                setIsOpenSliderImage(true);
                setAttachmentData(record?.companyProfile);
              }}
            />
          </>
        );
      },
    },
    { title: <Header>{t('common.name')}</Header>, dataIndex: 'name' },
    { title: <Header>{t('common.address')}</Header>, dataIndex: 'address' },
    { title: <Header>{t('common.bio')}</Header>, dataIndex: 'bio' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.numberOfTransfers')}</Header>,
      dataIndex: 'numberOfTransfers',
    },
    { title: <Header>{t('branch.region')}</Header>, dataIndex: ['region', 'name'] },
    {
      title: <Header>{t('requests.services')}</Header>,
      dataIndex: 'services',
      render: (record: any) => (
        <Space style={{ display: 'grid' }}>
          {record?.map((service: any) => (
            <Tag key={service?.id}>{service?.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: <Header>{t('companies.status')}</Header>,
      dataIndex: 'status',
      render: (index: number, record: any) => {
        return (
          <>
            {record.statues === 1 && (
              <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
                {t('companies.checking')}
              </Tag>
            )}
            {record.statues === 2 && (
              <Tag key={record?.id} color="#01509a" style={{ padding: '4px' }}>
                {t('companies.approved')}
              </Tag>
            )}
            {record.statues === 3 && (
              <Tag key={record?.id} color="#ff5252" style={{ padding: '4px' }}>
                {t('companies.rejected')}
              </Tag>
            )}
          </>
        );
      },
    },
    // {
    //   title: <Header>{t('common.actions')}</Header>,
    //   dataIndex: 'actions',
    //   render: (index: number, record: RequestModel) => {
    //     return (
    //       <Space>
    //         <TableButton
    //           severity="info"
    //           onClick={() => {
    //             handleModalOpen('edit');
    //           }}
    //         >
    //           <EditOutlined />
    //         </TableButton>
    //       </Space>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <Row justify={'end'}>
        {/*    Image    */}
        {isOpenSliderImage ? (
          <Modal
            size={isDesktop || isTablet ? 'medium' : 'small'}
            open={isOpenSliderImage}
            onCancel={() => setIsOpenSliderImage(false)}
            footer={null}
            closable={false}
            destroyOnClose
          >
            <AntdImage
              preview={false}
              style={{ borderRadius: '.3rem' }}
              src={attachmentData !== undefined ? attachmentData?.url : ''}
              size={isDesktop || isTablet ? 'small' : isMobile ? 'x_small' : mobileOnly ? 'xx_small' : 'x_small'}
            />
          </Modal>
        ) : null}
      </Row>

      <Card
        title={t('requests.suitableCompanies')}
        padding={
          dataCompany === undefined ||
          dataCompany?.length === 0 ||
          (pageCompany === 1 && totalCountCompany <= pageSizeCompany)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Table
          pagination={{
            showSizeChanger: true,
            onChange: (pageCompany: number, pageSizeCompany: number) => {
              setPageCompany(pageCompany);
              setPageSizeCompany(pageSizeCompany);
            },
            current: pageCompany,
            pageSize: pageSizeCompany,
            showQuickJumper: true,
            responsive: true,
            showTitle: false,
            showLessItems: true,
            total: totalCountCompany || 0,
            hideOnSinglePage: true,
          }}
          columns={columnsCompany.map((col) => ({ ...col, width: 'auto' }))}
          loading={loadingCompany}
          dataSource={dataCompany}
          scroll={{ x: isTablet || isMobile ? 950 : 800 }}
        />
      </Card>

      <Card
        title={t('requests.suitableBranches')}
        padding={
          dataBranch === undefined ||
          dataBranch?.length === 0 ||
          (pageBranch === 1 && totalCountBranch <= pageSizeBranch)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Table
          pagination={{
            showSizeChanger: true,
            onChange: (pageBranch: number, pageSizeBranch: number) => {
              setPageBranch(pageBranch);
              setPageSizeBranch(pageSizeBranch);
            },
            current: pageBranch,
            pageSize: pageSizeBranch,
            showQuickJumper: true,
            responsive: true,
            showTitle: false,
            showLessItems: true,
            total: totalCountBranch || 0,
            hideOnSinglePage: true,
          }}
          columns={columnsBranch.map((col) => ({ ...col, width: 'auto' }))}
          loading={loadingBranch}
          dataSource={dataBranch}
          scroll={{ x: isTablet || isMobile ? 950 : 800 }}
        />
      </Card>
    </>
  );
};
