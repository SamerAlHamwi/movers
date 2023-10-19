import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { getAllPoints, CreatePoint, DeletePoint, UpdatePoint } from '@app/services/points';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { Point } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { AddPoint } from '@app/components/modal/AddPoint';
import { EditPoint } from '@app/components/modal/EditPoint';

export const Points: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<Point[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<Point | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<Point | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Points', page, pageSize, refetchOnAdd, isDelete, isEdit],
    () =>
      getAllPoints(page, pageSize, searchString)
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
  }, [isDelete, refetchOnAdd, isEdit, page, pageSize, language, searchString]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addPoint = useMutation((data: any) =>
    CreatePoint(data)
      .then((data) => {
        notificationController.success({ message: t('points.addPointSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addPoint.isLoading }));
  }, [addPoint.isLoading]);

  const deletePoint = useMutation((id: number) =>
    DeletePoint(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('points.deletePointSuccessMessage')} type={`success`} showIcon />,
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
      deletePoint.mutateAsync(id);
      setPage(page - 1);
    } else {
      deletePoint.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deletePoint.isLoading }));
  }, [deletePoint.isLoading]);

  const editPoint = useMutation((data: Point) => UpdatePoint(data));

  const handleEdit = (data: Point, id: number) => {
    editPoint
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`points.editPointSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editPoint.isLoading }));
  }, [editPoint.isLoading]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>,
      dataIndex: 'name',
      render: (name: Point) => {
        return <>{name}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('points.numberOfPoint')}</Header>,
      dataIndex: 'numberOfPoint',
      render: (numberOfPoint: Point) => {
        return <>{numberOfPoint}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('points.price')}</Header>,
      dataIndex: 'price',
      render: (price: Point) => {
        return <>{price}</>;
      },
    },
    {
      title: <Header>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: any) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setEditmodaldata(record);
                  handleModalOpen('edit');
                }}
              >
                <EditOutlined />
              </TableButton>
            </Tooltip>

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
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('points.pointsList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row justify={'end'}>
          <Button
            type="primary"
            style={{
              marginBottom: '.5rem',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => handleModalOpen('add')}
          >
            <CreateButtonText>{t('points.addPoint')}</CreateButtonText>
          </Button>

          {/*    Add    */}
          {modalState.add && (
            <AddPoint
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                addPoint.mutateAsync(info);
              }}
              isLoading={addPoint.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditPoint
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editPoint.isLoading}
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
              title={t('points.deletePointModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('points.deletePointModalDescription')}
              isDanger={true}
              isLoading={deletePoint.isLoading}
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
