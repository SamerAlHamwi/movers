import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Alert, Row, Space, Tooltip, message } from 'antd';
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
import { DeleteTerm, UpdateTerm, createTerm, getAllTerm } from '@app/services/terms';
import { EditTerm } from '@app/components/modal/EditTerm';
import { AddTerm } from '@app/components/modal/AddTerm';
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
  const [refetchOnAddTerm, setRefetchOnAddTerm] = useState(false);

  const { refetch, isRefetching } = useQuery(
    ['Term messages', page, isDelete, pageSize, refetchOnAddTerm],
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
    setRefetchOnAddTerm(false);
  }, [isDelete, isEdit, refetchOnAddTerm, page, pageSize, searchString, refetch]);

  useEffect(() => {
    if (isRefetching) setIsLoading(true);
    else setIsLoading(false);
  }, [isRefetching]);

  const addTerm = useMutation((data: Term) =>
    createTerm(data)
      .then((data) => {
        notificationController.success({ message: t('terms.sendSuccessMessage') });
        setRefetchOnAddTerm(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setIsOpenPushModalForm(addTerm.isLoading);
  }, [addTerm.isLoading]);

  const deleteTerm = useMutation((id: number) =>
    DeleteTerm(id)
      .then((data: any) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('terms.deleteTermsSuccessMessage')} type={`success`} showIcon />,
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
          content: <Alert message={t(`terms.editTermSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setIsOpenEditModalForm(editTerm.isLoading);
  }, [editTerm.isLoading]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.title_en')}</Header>,
      dataIndex: ['translations', 0, 'title'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.title_ar')}</Header>,
      dataIndex: ['translations', 1, 'title'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.description_en')}</Header>,
      dataIndex: ['translations', 0, 'description'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.description_ar')}</Header>,
      dataIndex: ['translations', 1, 'description'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: any) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setEditmodaldata(record);
                  setIsOpenEditModalForm(true);
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
                  setIsOpenDeleteModalForm(true);
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
        title={t('terms.TermsList')}
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
            <CreateButtonText>{t('terms.addTerm')}</CreateButtonText>
          </Button>

          {/*    Add    */}
          {isOpenPushModalForm && (
            <AddTerm
              isManager={user.userType === 0 ? false : true}
              visible={isOpenPushModalForm}
              onCancel={() => setIsOpenPushModalForm(false)}
              onCreateTerm={(data) => {
                addTerm.mutateAsync(data);
              }}
              isLoading={addTerm.isLoading}
            />
          )}

          {/*    EDIT    */}
          {isOpenEditModalForm && (
            <EditTerm
              Term_values={editmodaldata}
              visible={isOpenEditModalForm}
              onCancel={() => setIsOpenEditModalForm(false)}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id ?? 0)}
              isLoading={editTerm.isLoading}
            />
          )}

          {/*    Delete    */}
          {isOpenDeleteModalForm && (
            <ActionModal
              visible={isOpenDeleteModalForm}
              onCancel={() => setIsOpenDeleteModalForm(false)}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('terms.deleteTermModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('terms.deleteTermModalDescription')}
              isDanger={true}
              isLoading={deleteTerm.isLoading}
            />
          )}
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
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          loading={isLoading}
          scroll={{ x: isTablet ? 700 : isMobile ? 800 : 600 }}
        />
      </Card>
    </>
  );
};
