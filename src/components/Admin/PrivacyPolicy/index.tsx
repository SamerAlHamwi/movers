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
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { Deleteprivacy, Updateprivacy, createPrivacy, getAllprivacy } from '../../../services/privacy';
import { AddPrivacyPolicy } from '@app/components/modal/AddPrivacyPolicy';
import { EditPrivacyPolicy } from '@app/components/modal/EditPrivacyPolicy';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';

export type Translation = {
  title: string;
  description: string;
  language: LanguageType;
};

export type PrivacyPolicy = {
  id?: number;
  description: string;
  title: string;
  translations: Translation[];
};

export const PrivacyPolicy: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop } = useResponsive();

  const [privacyData, setPrivacyData] = useState<Notification[] | undefined>(undefined);
  const [isOpenPushModalForm, setIsOpenPushModalForm] = useState(false);
  const [isOpenEditModalForm, setIsOpenEditModalForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDeleteModalForm, setIsOpenDeleteModalForm] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<PrivacyPolicy | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<PrivacyPolicy | undefined>(undefined);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const { refetch, isRefetching } = useQuery(
    ['PrivacyPolicy', page, isDelete, pageSize, refetchOnAdd],
    () =>
      getAllprivacy(page, pageSize, searchString)
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          result?.forEach((element: PrivacyPolicy) => {
            const enTranslationIndex = element.translations?.findIndex(
              (translation: Translation) => translation.language === 'en',
            );
            if (enTranslationIndex > -1) {
              const enTranslation = element.translations.splice(enTranslationIndex, 1);
              element.translations.unshift(enTranslation[0]);
            }
          });
          setPrivacyData(result);
          setIsLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setIsLoading(false);
        }),
    {
      enabled: privacyData === undefined,
    },
  );

  useEffect(() => {
    if (isRefetching) setIsLoading(true);
    else setIsLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setIsLoading(true);
    refetch();
    setIsDelete(false);
    setIsEdit(false);
    setRefetchOnAdd(false);
  }, [isDelete, isEdit, refetchOnAdd, page, pageSize, language, searchString, refetch, refetchData]);

  const pushprivacy = useMutation((data: PrivacyPolicy) =>
    createPrivacy(data)
      .then((data) => {
        notificationController.success({ message: t('privacyPolicy.addPrivacySuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setIsOpenPushModalForm(pushprivacy.isLoading);
  }, [pushprivacy.isLoading]);

  const deleteprivacy = useMutation((id: number) =>
    Deleteprivacy(id)
      .then((data: any) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('privacyPolicy.deletePrivacySuccessMessage')} type={`success`} showIcon />,
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
      deleteprivacy.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteprivacy.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenDeleteModalForm(deleteprivacy.isLoading);
  }, [deleteprivacy.isLoading]);

  const editprivacy = useMutation((data: PrivacyPolicy) => Updateprivacy(data));

  const handleEdit = (data: PrivacyPolicy, id: number) => {
    editprivacy
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`privacyPolicy.editPrivacySuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };
  useEffect(() => {
    setIsOpenEditModalForm(editprivacy.isLoading);
  }, [editprivacy.isLoading]);

  const columns = [
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>,
      dataIndex: 'id',
      width: '5%',
    },
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
        return <div style={{ fontFamily: 'Cairo' }}>{text}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.description_en')}</Header>,
      dataIndex: ['translations', 0, 'description'],
      render: (text: string) => {
        const firstSentence = text.split('.')[0];

        return <div style={{ fontFamily: 'Lato' }}>{firstSentence}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.description_ar')}</Header>,
      dataIndex: ['translations', 1, 'description'],
      render: (text: string) => {
        const firstSentence = text.split('.')[0];
        return <div style={{ fontFamily: 'Lato' }}>{firstSentence}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, Data: PrivacyPolicy) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setEditmodaldata(Data);
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
                  setDeletemodaldata(Data);
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
        title={t('privacyPolicy.PrivacyList')}
        padding={
          privacyData?.length === 0 || privacyData === undefined || (page === 1 && totalCount <= pageSize)
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
            <CreateButtonText>{t('privacyPolicy.addPrivacy')}</CreateButtonText>
          </Button>
          <ReloadBtn setRefetchData={setRefetchData} />
          {/* Add */}
          {isOpenPushModalForm && (
            <AddPrivacyPolicy
              visible={isOpenPushModalForm}
              onCancel={() => setIsOpenPushModalForm(false)}
              onCreateprivacy={(data) => {
                pushprivacy.mutateAsync(data);
              }}
              isLoading={pushprivacy.isLoading}
            />
          )}

          {/* Edit */}
          {isOpenEditModalForm && (
            <EditPrivacyPolicy
              Priv_values={editmodaldata}
              visible={isOpenEditModalForm}
              onCancel={() => setIsOpenEditModalForm(false)}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id ?? 0)}
              isLoading={editprivacy.isLoading}
            />
          )}

          {/* Delete */}
          {isOpenDeleteModalForm && (
            <ActionModal
              visible={isOpenDeleteModalForm}
              onCancel={() => setIsOpenDeleteModalForm(false)}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('privacyPolicy.deletePrivacytModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('privacyPolicy.deletePrivacyModalDescription')}
              isDanger={true}
              isLoading={deleteprivacy.isLoading}
            />
          )}
        </Row>

        <Table
          dataSource={privacyData}
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
            hideOnSinglePage: false,
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
