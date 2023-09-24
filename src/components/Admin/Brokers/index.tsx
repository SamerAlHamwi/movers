import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { Broker, UserModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { EditBroker } from '@app/components/modal/EditBroker';
import { AddBrokr } from '@app/components/modal/AddBroker';
import { CreateM, DeleteM, Updatem, getAllM } from '../../../services/mediator';
import { useLanguage } from '@app/hooks/useLanguage';

export const Brokers: React.FC = () => {
  const { t } = useTranslation();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();
  const { language } = useLanguage();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<UserModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<Broker | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<Broker | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [refetchOnAddManager, setRefetchOnAddManager] = useState(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
    console.log(modalState);
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Partner', page, pageSize, refetchOnAddManager, isDelete, isEdit, isActivate, isDeActivate, isAdmin, isEmployee],
    () =>
      getAllM(page, pageSize)
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
    if (isRefetching) {
      setLoading(true);
    } else setLoading(false);
  }, [isRefetching, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsEdit(false);
    setIsDelete(false);
  }, [isDelete, isEdit, page, pageSize, language, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setRefetchOnAddManager(false);
  }, [refetchOnAddManager, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsActivate(false);
    setIsDeActivate(false);
    setIsAdmin(false);
    setIsEmployee(false);
  }, [isActivate, isDeActivate, refetch]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addManager = useMutation((data: Broker) =>
    CreateM(data)
      .then((data) => {
        notificationController.success({ message: t('Brokers.addPartnerSuccessMessage') });
        setRefetchOnAddManager(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addManager.isLoading }));
  }, [addManager.isLoading]);

  const deletePartner = useMutation((id: number) =>
    DeleteM(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('Brokers.deletePartnerSuccessMessage')} type={`success`} showIcon />,
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
      deletePartner.mutateAsync(id);
      setPage(page - 1);
    } else {
      deletePartner.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deletePartner.isLoading }));
  }, [deletePartner.isLoading]);

  const editPartner = useMutation((data: Broker) => Updatem(data));

  const handleEdit = (data: Broker, id: number) => {
    editPartner
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`Brokers.editPartnerSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editPartner.isLoading }));
  }, [editPartner.isLoading]);

  const columns = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header>{t('Brokers.partnerPhoneNumber')}</Header>, dataIndex: 'mediatorPhoneNumber' },
    { title: <Header>{t('Brokers.partnercode')}</Header>, dataIndex: 'mediatorCode' },
    { title: <Header>{t('Brokers.partnerdiscountPercentage')}</Header>, dataIndex: 'commissionPercentage' },
    { title: <Header>{t('Brokers.mediatorProfit')}</Header>, dataIndex: 'mediatorProfit' },
    {
      title: <Header>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: Broker) => {
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
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('Brokers.BrokersList')}
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
            <CreateButtonText>{t('Brokers.addPartner')}</CreateButtonText>
          </Button>
          {/*    Add    */}
          {modalState.add && (
            <AddBrokr
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreateBroker={(BrokerInfo) => {
                addManager.mutateAsync(BrokerInfo);
              }}
              isLoading={addManager.isLoading}
            />
          )}
          {/*    EDIT    */}
          {modalState.edit && (
            <EditBroker
              Brokr_values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editPartner.isLoading}
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
              title={t('Brokers.deletePartnerModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              // description={t('managers.deleteManagerModalDescription')}
              isDanger={true}
              isLoading={deletePartner.isLoading}
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
