import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { EditRequest } from '@app/components/modal/EditRequest';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { getAllOffers, createRequest, DeleteRequest, UpdateRequest, confirmRequest } from '@app/services/requests';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { RequestModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import Tag from 'antd/es/tag';
import { useNavigate, useParams } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useSelector } from 'react-redux';

export const Offers: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop } = useResponsive();
  const { requestId } = useParams();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
    approve: false,
    reject: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<RequestModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<RequestModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<RequestModel | undefined>(undefined);
  const [approvemodaldata, setApprovemodaldata] = useState<RequestModel | undefined>(undefined);
  const [rejectmodaldata, setRejectmodaldata] = useState<RequestModel | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Offers', page, pageSize, refetchOnAdd, isDelete, isEdit, isApproved, isRejected],
    () =>
      getAllOffers(page, pageSize, searchString, requestId)
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
    setIsEdit(false);
    setIsDelete(false);
    setRefetchOnAdd(false);
  }, [isDelete, refetchOnAdd, isEdit, isApproved, isRejected, page, pageSize, language, searchString, refetch]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addRequest = useMutation((data: any) =>
    createRequest(data)
      .then((data) => {
        notificationController.success({ message: t('requests.addRequestSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addRequest.isLoading }));
  }, [addRequest.isLoading]);

  const deleteRequest = useMutation((id: number) =>
    DeleteRequest(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('requests.deleteRequestSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleDelete = (id: any) => {
    if (page > 1 && dataSource?.length === 1) {
      deleteRequest.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteRequest.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteRequest.isLoading }));
  }, [deleteRequest.isLoading]);

  const editRequest = useMutation((data: RequestModel) => UpdateRequest(data));

  const handleEdit = (data: RequestModel, id: number) => {
    editRequest
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`requests.editRequestSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editRequest.isLoading }));
  }, [editRequest.isLoading]);

  const approveRequest = useMutation((data: any) =>
    confirmRequest(data)
      .then((data) => {
        data.data?.success &&
          (setIsApproved(data.data?.success),
          message.open({
            content: <Alert message={t('requests.approveRequestSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleApprove = (id: any) => {
    const data = { requestId: id, statues: 2 };
    approveRequest.mutateAsync(data);
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, approve: approveRequest.isLoading }));
  }, [approveRequest.isLoading]);

  const rejectRequest = useMutation((data: any) =>
    confirmRequest(data)
      .then((data) => {
        data.data?.success &&
          (setIsRejected(data.data?.success),
          message.open({
            content: <Alert message={t('requests.rejectRequestSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleReject = (id: any) => {
    const data = { requestId: id, statues: 3 };
    rejectRequest.mutateAsync(data);
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, reject: rejectRequest.isLoading }));
  }, [rejectRequest.isLoading]);

  const columns = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header>{t('offers.price')}</Header>, dataIndex: 'price' },
    {
      title: <Header>{t('offers.provider')}</Header>,
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
      title: <Header>{t('requests.status')}</Header>,
      dataIndex: 'status',
      render: (index: number, record: RequestModel) => {
        return (
          <>
            {record.statues === 1 && (
              <Space>
                <TableButton
                  severity="info"
                  onClick={() => {
                    setApprovemodaldata(record);
                    handleModalOpen('approve');
                  }}
                >
                  <CheckOutlined />
                </TableButton>
                <TableButton
                  severity="error"
                  onClick={() => {
                    setRejectmodaldata(record);
                    handleModalOpen('reject');
                  }}
                >
                  <CloseOutlined />
                </TableButton>
              </Space>
            )}
            {record.statues === 2 && (
              <Tag key={record?.id} color="#01509a" style={{ padding: '4px' }}>
                {t('requests.approved')}
              </Tag>
            )}
            {record.statues === 3 && (
              <Tag key={record?.id} color="#ff5252" style={{ padding: '4px' }}>
                {t('requests.rejected')}
              </Tag>
            )}
          </>
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
      >
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
    </>
  );
};
