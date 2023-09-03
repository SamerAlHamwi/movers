import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  createNotification,
  getAllNotification,
  DeleteNotifaction,
  UpdateNotification,
} from '@app/services/notification';
import { useMutation, useQuery } from 'react-query';
import { Alert, Row, Space, message } from 'antd';
import { Card } from 'components/common/Card/Card';
import { Header, TableButton } from '../../GeneralStyles';
import { Table as T } from '@app/components/common/Table/Table';
import { PushNotification } from '@app/components/modal/PushNotification';
import { useResponsive } from '@app/hooks/useResponsive';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Button } from '@app/components/common/buttons/Button/Button';
import styled from 'styled-components';
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Modal, Table, CreateButtonText } from '../../GeneralStyles';
import { LanguageType } from '@app/interfaces/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { EditNotifaction } from '@app/components/modal/EditNotifaction';

export type Translation = {
  message: string;
  language: LanguageType;
};

export type Notification = {
  id?: number;
  destination: number;
  translations: Translation[];
};

const Destination = [
  'notifications.destination.all',
  'notifications.destination.Users',
  'notifications.destination.Companies',
];

export const Notifications: React.FC = () => {
  const { t } = useTranslation();

  const [notificationsData, setNotificationsData] = useState<Notification[] | undefined>(undefined);
  const [isOpenPushModalForm, setIsOpenPushModalForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDeleteModalForm, setIsOpenDeleteModalForm] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<Notification | undefined>(undefined);
  const [isOpenEditModalForm, setIsOpenEditModalForm] = useState(false);
  const [deletemodaldata, setDeletemodaldata] = useState<Notification | undefined>(undefined);
  const { isTablet, isMobile, isDesktop } = useResponsive();
  const [refetchOnAddNotification, setRefetchOnAddNotification] = useState(false);

  const user = useAppSelector((state) => state.user.user);

  const { refetch, isRefetching } = useQuery(
    ['Notifications messages', page, isDelete, pageSize, refetchOnAddNotification],
    () =>
      getAllNotification(page, pageSize)
        .then((data) => {
          const notifications = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          notifications?.forEach((element: Notification) => {
            const enTranslationIndex = element.translations?.findIndex(
              (translation: Translation) => translation.language === 'en',
            );
            if (enTranslationIndex > -1) {
              const enTranslation = element.translations.splice(enTranslationIndex, 1);
              element.translations.unshift(enTranslation[0]);
            }
          });
          setNotificationsData(notifications);
          setIsLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setIsLoading(false);
        }),
    {
      enabled: notificationsData === undefined,
    },
  );

  useEffect(() => {
    isRefetching && setIsLoading(true);
  }, [isRefetching]);

  useEffect(() => {
    setIsLoading(true);
    refetch();
  }, [page, pageSize, refetch]);

  useEffect(() => {
    setIsLoading(true);
    refetch();
    setRefetchOnAddNotification(false);
  }, [refetchOnAddNotification]);
  useEffect(() => {
    setIsLoading(true);
    refetch();
    setIsDelete(false);
  }, [isDelete, , page, pageSize, refetch]);
  const pushNotification = useMutation((data: Notification) =>
    createNotification(data)
      .then((data) => {
        notificationController.success({ message: t('notifications.sendSuccessMessage') });
        setRefetchOnAddNotification(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setIsOpenPushModalForm(pushNotification.isLoading);
  }, [pushNotification.isLoading]);
  const deleteNotification = useMutation((id: number) =>
    DeleteNotifaction(id)
      .then((data: any) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('notifications.deleteNotifactionsSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error: any) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );
  const handleDelete = (id: any) => {
    if (page > 1) {
      deleteNotification.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteNotification.mutateAsync(id);
    }
  };
  useEffect(() => {
    setIsOpenDeleteModalForm(deleteNotification.isLoading);
  }, [deleteNotification.isLoading]);
  const editNoification = useMutation((data: Notification) => UpdateNotification(data));

  const handleEdit = (data: Notification, id: number) => {
    editNoification
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`managers.editManagerSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };
  useEffect(() => {
    setIsOpenEditModalForm(editNoification.isLoading);
  }, [editNoification.isLoading]);

  const notificationsColumns = [
    {
      title: (
        <Header>
          <Trans i18nKey={'common.id'} />
        </Header>
      ),
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.englishMessage'} />
        </Header>
      ),
      dataIndex: ['translations', 0, 'message'],
      width: '30%',
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.arabicMessage'} />
        </Header>
      ),
      dataIndex: ['translations', 1, 'message'],
      width: '30%',
      render: (text: string) => {
        return <div style={{ fontFamily: 'Cairo' }}>{text}</div>;
      },
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.actions'} />
        </Header>
      ),

      dataIndex: 'actions',
      width: '30%',
      render: (index: number, Data: Notification) => {
        return (
          <Space>
            <TableButton
              severity="error"
              onClick={() => {
                setDeletemodaldata(Data);
                setIsOpenDeleteModalForm(true);
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
        title={t('notifications.notificationsList')}
        padding={
          notificationsData?.length === 0 || notificationsData === undefined || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0rem'
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
            onClick={() => setIsOpenPushModalForm(true)}
          >
            <CreateButtonText>{t('notifications.send')}</CreateButtonText>
          </Button>
          {/* {isOpenEditModalForm ? (
            <EditNotifaction
              Not_values={editmodaldata}
              visible={isOpenEditModalForm}
              onCancel={() => setIsOpenEditModalForm(false)}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id ?? 0)}
              isLoading={editNoification.isLoading}
            />
          ) : null} */}
          {isOpenPushModalForm ? (
            <PushNotification
              isManager={user.userType === 0 ? false : true}
              visible={isOpenPushModalForm}
              onCancel={() => setIsOpenPushModalForm(false)}
              onCreateNotification={(data) => {
                pushNotification.mutateAsync(data);
              }}
              isLoading={pushNotification.isLoading}
            />
          ) : null}
          {isOpenDeleteModalForm ? (
            <ActionModal
              visible={isOpenDeleteModalForm}
              onCancel={() => setIsOpenDeleteModalForm(false)}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('notifications.deleteNotficationModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('notifications.deleteNotifactionModalDescription')}
              isDanger={true}
              isLoading={deleteNotification.isLoading}
            />
          ) : null}
        </Row>

        <Table
          dataSource={notificationsData}
          pagination={{
            showSizeChanger: true,
            onChange: (page: number, pageSize: number) => {
              setPage(page);
              setPageSize(pageSize);
            },
            pageSize: pageSize,
            current: page,
            showQuickJumper: true,
            showTitle: false,
            total: totalCount || 0,
            hideOnSinglePage: true,
            responsive: true,
            showLessItems: true,
            // showTotal: (total) => `Total ${total} notifications`,
            pageSizeOptions: [5, 10, 15, 20],
          }}
          columns={
            user.userType === 1
              ? notificationsColumns
              : [
                  ...notificationsColumns,
                  {
                    title: <Header>{t('notifications.destination.destination')}</Header>,
                    dataIndex: 'destination',
                    width: '15%',
                    render: (destination: number) => {
                      return <>{t(Destination[destination])}</>;
                    },
                  },
                ]
          }
          loading={isLoading}
          scroll={{ x: isTablet ? 700 : isMobile ? 800 : 600 }}
        />
      </Card>
    </>
  );
};
