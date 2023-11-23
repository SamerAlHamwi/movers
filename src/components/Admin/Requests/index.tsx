import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { EditRequest } from '@app/components/modal/EditRequest';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  TagOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { getAllRequests, createRequest, DeleteRequest, UpdateRequest, confirmRequest } from '@app/services/requests';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText, TextBack } from '../../GeneralStyles';
import { RequestModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import Tag from 'antd/es/tag';
import { useNavigate, useParams } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useSelector } from 'react-redux';
import { SearchForUser } from '@app/components/modal/SearchForUser';
import { checkPIN } from '@app/services/drafts';
import { SendRejectReason } from '@app/components/modal/SendRejectReason';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';

export const Requests: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();
  const { type, brokerId } = useParams();

  const [modalState, setModalState] = useState({
    searchForUser: false,
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
  const [rejectmodaldata, setRejectmodaldata] = useState<RequestModel | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [userId, setUserId] = useState<number>(0);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Requests', type, brokerId, page, pageSize, refetchOnAdd, isDelete, isEdit, isApproved, isRejected],
    () =>
      getAllRequests(type, brokerId, page, pageSize, searchString)
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

  const handleReject = (info: any) => {
    const data = { requestId: rejectmodaldata?.id, statues: 3, reasonRefuse: info.reasonRefuse };
    rejectRequest.mutateAsync(data);
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, reject: rejectRequest.isLoading }));
  }, [rejectRequest.isLoading]);

  const confirm = useMutation((data) =>
    checkPIN(data)
      .then((data) => {
        if (data.data?.success && data.data?.result?.isOwner) {
          message.open({
            content: <Alert message={t('requests.truePIN')} type={`success`} showIcon />,
          });
          Navigate(`/${userId}/drafts`);
        } else if (data.data?.success && !data.data?.result?.isOwner) {
          message.open({
            content: <Alert message={t('requests.falsePIN')} type={`error`} showIcon />,
          });
        }
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

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
    // {
    //   title: <Header style={{ wordBreak: 'normal' }}>{t('requests.services')}</Header>,
    //   dataIndex: 'services',
    //   render: (record: any) => (
    //     <Space style={{ display: 'grid' }}>
    //       {record?.map((service: any) => (
    //         <Tag key={service?.id}>{service?.name}</Tag>
    //       ))}
    //     </Space>
    //   ),
    // },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.sourceType')}</Header>,
      dataIndex: 'sourceType',
      render: (record: any) => {
        return <>{record?.name}</>;
      },
    },
    type !== 'viaBroker' && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.suitableCompanies&Branches')}</Header>,
      dataIndex: 'suitableCompanies&Branches',
      render: (index: number, record: any) => (
        <Space>
          <Button
            disabled={record.statues !== 1}
            style={{ height: '2.4rem' }}
            severity="info"
            onClick={() => {
              Navigate(`${record.id}/suitableCompanies&Branches/1`, { state: record.name });
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
    type !== 'viaBroker' && {
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
                Navigate(`${record.id}/offers`, { state: record.name });
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
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.status')}</Header>,
      dataIndex: 'status',
      render: (index: number, record: RequestModel) => {
        return (
          <>
            {record.statues === 1 && (
              <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
                {t('requests.checking')}
              </Tag>
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
            {record.statues === 4 && (
              <Tag key={record?.id} color="#546E7A" style={{ padding: '4px' }}>
                {t('requests.possible')}
              </Tag>
            )}
            {record.statues === 5 && (
              <Tag key={record?.id} color="#f9a3a4" style={{ padding: '4px' }}>
                {t('requests.hasOffers')}
              </Tag>
            )}
            {record.statues === 6 && (
              <Tag key={record?.id} color="#2b908f" style={{ padding: '4px' }}>
                {t('requests.inProcess')}
              </Tag>
            )}
            {record.statues === 7 && (
              <Tag key={record?.id} color="#73d13d" style={{ padding: '4px' }}>
                {t('requests.FinishByCompany')}
              </Tag>
            )}
            {record.statues === 8 && (
              <Tag key={record?.id} color="#90ee7e" style={{ padding: '4px' }}>
                {t('requests.FinishByUser')}
              </Tag>
            )}
            {record.statues === 9 && (
              <Tag key={record?.id} color="#d4526e" style={{ padding: '4px' }}>
                {t('requests.NotFinishByUser')}
              </Tag>
            )}
            {record.statues === 10 && (
              <Tag key={record?.id} color="#33b2df" style={{ padding: '4px' }}>
                {t('requests.Finished')}
              </Tag>
            )}
            {record?.statues === 11 && (
              <Tag key={record?.id} color="#faad14" style={{ padding: '4px' }}>
                {t('requests.canceled')}
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
            <Tooltip placement="top" title={t('common.details')}>
              <TableButton
                severity="success"
                onClick={() => {
                  Navigate(`${record.id}/details`, { state: record.name });
                }}
              >
                <TagOutlined />
              </TableButton>
            </Tooltip>

            {type !== 'viaBroker' && (
              <Tooltip placement="top" title={t('common.reject')}>
                <TableButton
                  disabled={record.statues !== 1}
                  severity="error"
                  onClick={() => {
                    setRejectmodaldata(record);
                    handleModalOpen('reject');
                  }}
                >
                  <CloseOutlined />
                </TableButton>
              </Tooltip>
            )}

            {/* {type !== 'viaBroker' && <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                disabled={record.statues !== 1}
                severity="info"
                onClick={() => {
                  Navigate(`/requests/${record.id}/EditRequest`);
                }}
              >
                <EditOutlined />
              </TableButton>
            </Tooltip> }*/}

            {type !== 'viaBroker' && (
              <Tooltip placement="top" title={t('common.delete')}>
                <TableButton
                  severity="error"
                  onClick={() => {
                    setDeletemodaldata(record);
                    handleModalOpen('delete');
                  }}
                >
                  <DeleteOutlined />
                </TableButton>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ].filter(Boolean);

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
          {type !== 'viaBroker' && (
            <Button
              type="primary"
              style={{
                marginBottom: '.5rem',
                width: 'auto',
                height: 'auto',
              }}
              onClick={() => handleModalOpen('searchForUser')}
            >
              <CreateButtonText>{t('requests.addRequest')}</CreateButtonText>
            </Button>
          )}
          {type === 'viaBroker' && (
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
          )}

          {/*    Search For User Name    */}
          {modalState.searchForUser && (
            <SearchForUser
              visible={modalState.searchForUser}
              onCancel={() => handleModalClose('searchForUser')}
              onCreate={(info, id) => {
                setUserId(id);
                confirm.mutateAsync(info);
              }}
              isLoading={confirm.isLoading}
            />
          )}

          {/*    EDIT    */}
          {/* {modalState.edit && (
            <EditRequest
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editRequest.isLoading}
            />
          )} */}

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

          {/*    Reject    */}
          {modalState.reject && (
            <SendRejectReason
              visible={modalState.reject}
              onCancel={() => handleModalClose('reject')}
              onCreate={(info) => {
                handleReject(info);
                // const data = { requestId: id, statues: 3 };
                // rejectRequest.mutateAsync(data);
              }}
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
