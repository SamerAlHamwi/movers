import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Alert, Row, Space, message } from 'antd';
import { Card } from 'components/common/Card/Card';
import { Header, TableButton } from '../../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Button } from '@app/components/common/buttons/Button/Button';
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Table, CreateButtonText } from '../../GeneralStyles';
import { LanguageType } from '@app/interfaces/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { DeleteTerm, UpdateTerm, createTerm, getAllTerm } from '@app/services/Term&condition';
import { EditTerm } from '@app/components/modal/EditTerm';
import { PushTerm } from '@app/components/modal/PushTerm';
import { useSelector } from 'react-redux';

export type Translation = {
  title: string;
  description: string;
  language: LanguageType;
};

export type Term = {
  id?: number;
  description: string;
  title: string;
  translations: Translation[];
};

export const Term: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const user = useAppSelector((state) => state.user.user);
  const { t } = useTranslation();

  const [TermsData, setTermsData] = useState<Term[] | undefined>(undefined);
  const [isOpenPushModalForm, setIsOpenPushModalForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDeleteModalForm, setIsOpenDeleteModalForm] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<Term | undefined>(undefined);
  const [isOpenEditModalForm, setIsOpenEditModalForm] = useState(false);
  const [deletemodaldata, setDeletemodaldata] = useState<Term | undefined>(undefined);
  const { isTablet, isMobile, isDesktop } = useResponsive();
  const [refetchOnAddNotification, setRefetchOnAddNotification] = useState(false);

  const { refetch, isRefetching } = useQuery(
    ['Term messages', page, isDelete, pageSize, refetchOnAddNotification],
    () =>
      getAllTerm(page, pageSize, searchString)
        .then((data) => {
          const Terms = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          Terms?.forEach((element: Term) => {
            const enTranslationIndex = element.translations?.findIndex(
              (translation: Translation) => translation.language === 'en',
            );
            if (enTranslationIndex > -1) {
              const enTranslation = element.translations.splice(enTranslationIndex, 1);
              element.translations.unshift(enTranslation[0]);
            }
          });
          setTermsData(Terms);
          setIsLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setIsLoading(false);
        }),
    {
      enabled: TermsData === undefined,
    },
  );

  useEffect(() => {
    setIsLoading(true);
    refetch();
    setIsDelete(false);
    setIsEdit(false);
    setRefetchOnAddNotification(false);
  }, [isDelete, isEdit, refetchOnAddNotification, page, pageSize, searchString, refetch]);

  useEffect(() => {
    if (isRefetching) setIsLoading(true);
    else setIsLoading(false);
  }, [isRefetching]);

  const pushTerm = useMutation((data: Term) =>
    createTerm(data)
      .then((data) => {
        notificationController.success({ message: t('Terms.sendSuccessMessage') });
        setRefetchOnAddNotification(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setIsOpenPushModalForm(pushTerm.isLoading);
  }, [pushTerm.isLoading]);

  const deleteTerm = useMutation((id: number) =>
    DeleteTerm(id)
      .then((data: any) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('Terms.deleteTermsSuccessMessage')} type={`success`} showIcon />,
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
      deleteTerm.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteTerm.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenDeleteModalForm(deleteTerm.isLoading);
  }, [deleteTerm.isLoading]);
  const editTerm = useMutation((data: Term) => UpdateTerm(data));

  const handleEdit = (data: Term, id: number) => {
    editTerm
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`Terms.editTermSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setIsOpenEditModalForm(editTerm.isLoading);
  }, [editTerm.isLoading]);

  const notificationsColumns = [
    {
      title: (
        <Header>
          <Trans i18nKey={'common.id'} />
        </Header>
      ),
      dataIndex: 'id',
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.englishtitle'} />
        </Header>
      ),
      dataIndex: ['translations', 0, 'title'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.arabictitle'} />
        </Header>
      ),
      dataIndex: ['translations', 1, 'title'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Cairo' }}>{text}</div>;
      },
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.englishdescription'} />
        </Header>
      ),
      dataIndex: ['translations', 0, 'description'],

      render: (text: string) => {
        const firstSentence = text.split('.')[0]; // Get the first sentence

        return <div style={{ fontFamily: 'Lato' }}>{firstSentence}</div>;
      },
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.arabicdiscription'} />
        </Header>
      ),
      dataIndex: ['translations', 1, 'description'],

      render: (text: string) => {
        const firstSentence = text.split('.')[0]; // Get the first sentence
        return <div style={{ fontFamily: 'Lato' }}>{firstSentence}</div>;
      },
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.actions'} />
        </Header>
      ),

      dataIndex: 'actions',
      render: (index: number, Data: Term) => {
        return (
          <Space>
            <TableButton
              severity="info"
              onClick={() => {
                setEditmodaldata(Data);
                setIsOpenEditModalForm(true);
              }}
            >
              <EditOutlined />
            </TableButton>

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
        title={t('Terms.TermsList')}
        padding={
          TermsData?.length === 0 || TermsData === undefined || (page === 1 && totalCount <= pageSize)
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
            <CreateButtonText>{t('notifications.sendp')}</CreateButtonText>
          </Button>
          {isOpenEditModalForm ? (
            <EditTerm
              Term_values={editmodaldata}
              visible={isOpenEditModalForm}
              onCancel={() => setIsOpenEditModalForm(false)}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id ?? 0)}
              isLoading={editTerm.isLoading}
            />
          ) : null}{' '}
          {isOpenPushModalForm ? (
            <PushTerm
              isManager={user.userType === 0 ? false : true}
              visible={isOpenPushModalForm}
              onCancel={() => setIsOpenPushModalForm(false)}
              onCreateTerm={(data) => {
                pushTerm.mutateAsync(data);
              }}
              isLoading={pushTerm.isLoading}
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
              title={t('notifications.deleteprivacyModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('notifications.deleteNprivacyModalDescription')}
              isDanger={true}
              isLoading={deleteTerm.isLoading}
            />
          ) : null}
        </Row>

        <Table
          dataSource={TermsData}
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
            pageSizeOptions: [5, 10, 15, 20],
          }}
          columns={user.userType === 1 ? notificationsColumns : [...notificationsColumns]}
          loading={isLoading}
          scroll={{ x: isTablet ? 700 : isMobile ? 800 : 600 }}
        />
      </Card>
    </>
  );
};
