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
import { getAllRequests, createRequest, DeleteRequest, UpdateRequest, confirmRequest } from '@app/services/requests';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { RequestModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import Tag from 'antd/es/tag';
import { useNavigate } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useSelector } from 'react-redux';

export const Requests: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop } = useResponsive();

  const [modalState, setModalState] = useState({
    // add: false,
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
    ['Requests', page, pageSize, refetchOnAdd, isDelete, isEdit, isApproved, isRejected],
    () =>
      getAllRequests(page, pageSize, searchString)
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
    setIsApproved(false);
    setIsRejected(false);
  }, [isDelete, refetchOnAdd, isEdit, isApproved, isRejected, page, pageSize, language, searchString]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  // const addRequest = useMutation((data: any) =>
  //   createRequest(data)
  //     .then((data) => {
  //       notificationController.success({ message: t('requests.addRequestSuccessMessage') });
  //       setRefetchOnAdd(data.data?.success);
  //     })
  //     .catch((error) => {
  //       notificationController.error({ message: error.message || error.error?.message });
  //     }),
  // );

  // useEffect(() => {
  //   setModalState((prevModalState) => ({ ...prevModalState, add: addRequest.isLoading }));
  // }, [addRequest.isLoading]);

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
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.sourceCity')}</Header>,
      dataIndex: 'sourceCity',
      render: (record: RequestModel) => {
        return <>{record?.name}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.destinationCity')}</Header>,
      dataIndex: 'destinationCity',
      render: (record: RequestModel) => {
        return <>{record?.name}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.serviceType')}</Header>,
      dataIndex: 'serviceType',
      render: (record: number) => {
        return (
          <>
            {record == 0
              ? '___'
              : record == 1
              ? t('requests.Internal')
              : record == 2
              ? t('requests.External')
              : `${t('requests.Internal')} & ${t('requests.External')}`}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.services')}</Header>,
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
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.sourceType')}</Header>,
      dataIndex: 'sourceType',
      render: (record: any) => {
        return <>{record?.name}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.suitableCompanies&Branches')}</Header>,
      dataIndex: 'suitableCompanies&Branches',
      render: (index: number, record: any) => (
        <Space>
          <Button
            disabled={record.statues !== 2}
            style={{ height: '2.4rem' }}
            severity="info"
            onClick={() => {
              navigate(`${record.id}/suitableCompanies&Branches`, { state: record.name });
            }}
          >
            <div
              style={{
                fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                fontWeight: FONT_WEIGHT.regular,
                width: 'auto',
              }}
            >
              {t('requests.suitableCompanies&Branches')}
            </div>
          </Button>
        </Space>
      ),
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.offers')}</Header>,
      dataIndex: 'offers',
      render: (index: number, record: any) => {
        return (
          <Space>
            <Button
              disabled={record.statues !== 2}
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/offers`, { state: record.name });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('requests.offers')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.details')}</Header>,
      dataIndex: 'details',
      render: (index: number, record: any) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/details`, { state: record.name });
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
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.status')}</Header>,
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
            {/* {record.statues === 1 && (
              <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
                {t('requests.checking')}
              </Tag>
            )} */}
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
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: RequestModel) => {
        return (
          <Space>
            <TableButton
              severity="info"
              onClick={() => {
                setEditmodaldata(record);
                handleModalOpen('edit');
              }}
            >
              <EditOutlined />
            </TableButton>

            <TableButton
              severity="error"
              onClick={() => {
                setDeletemodaldata(record);
                handleModalOpen('delete');
              }}
            >
              <DeleteOutlined />
            </TableButton>

            {/* <TableButton
              severity="warning"
              onClick={() => {
                setDeletemodaldata(record);
                handleModalOpen('reject');
              }}
            >
              <RedoOutlined />
            </TableButton> */}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('requests.requestsList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row justify={'end'}>
          {/* <Button
            type="primary"
            style={{
              marginBottom: '.5rem',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => navigate('/addRequest', { replace: false })}
          >
            <CreateButtonText>{t('requests.addRequest')}</CreateButtonText>
          </Button> */}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditRequest
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editRequest.isLoading}
            />
          )}

          {/*    Delete    */}
          {modalState.delete && (
            <ActionModal
              visible={modalState.delete}
              onCancel={() => handleModalClose('delete')}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('requests.deleteRequestModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('requests.deleteRequestModalDescription')}
              isDanger={true}
              isLoading={deleteRequest.isLoading}
            />
          )}

          {/*    Approve    */}
          {modalState.approve && (
            <ActionModal
              visible={modalState.approve}
              onCancel={() => handleModalClose('approve')}
              onOK={() => {
                approvemodaldata !== undefined && handleApprove(approvemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('requests.approveRequestModalTitle')}
              okText={t('common.approve')}
              cancelText={t('common.cancel')}
              description={t('requests.approveRequestModalDescription')}
              // isDanger={true}
              isLoading={approveRequest.isLoading}
            />
          )}

          {/*    Reject    */}
          {modalState.reject && (
            <ActionModal
              visible={modalState.reject}
              onCancel={() => handleModalClose('reject')}
              onOK={() => {
                rejectmodaldata !== undefined && handleReject(rejectmodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('requests.rejectRequestModalTitle')}
              okText={t('common.reject')}
              cancelText={t('common.cancel')}
              description={t('requests.rejectRequestModalDescription')}
              // isDanger={true}
              isLoading={rejectRequest.isLoading}
            />
          )}
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
    </>
  );
};
