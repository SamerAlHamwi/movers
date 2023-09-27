import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Row, Space, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { getAllSourceTypes, createSourceType, DeleteSourceType, UpdateSourceType } from '@app/services/sourceTypes';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { Attachment, SourceTypeModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddSourceType } from '@app/components/modal/AddSourceType';
import { EditSourceType } from '@app/components/modal/EditSourceType';
import { Image as AntdImage } from '@app/components/common/Image/Image';
import { useNavigate } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Header, TableButton, Modal, Image, CreateButtonText } from '../../GeneralStyles';
import { useSelector } from 'react-redux';

export type sourceTypes = {
  id: number;
  title: string;
  description: string;
  icon?: Attachment;
};

export const SourceType: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { mobileOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [attachmentData, setAttachmentData] = useState<sourceTypes>();
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<sourceTypes[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [dataSource, setDataSource] = useState<SourceTypeModel[] | undefined>(undefined);
  const [editmodaldata, setEditmodaldata] = useState<SourceTypeModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<SourceTypeModel | undefined>(undefined);
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
    console.log(modalState);
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['SourceTypes', page, pageSize],
    () =>
      getAllSourceTypes(page, pageSize, searchString)
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          setData(result);
          setLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setLoading(false);
        }),
    {
      enabled: Data === undefined,
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
    setRefetchOnAdd(false);
  }, [isDelete, isEdit, refetchOnAdd, page, pageSize, searchString, refetch]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addSourceType = useMutation((data: SourceTypeModel) =>
    createSourceType(data)
      .then((data) => {
        notificationController.success({ message: t('sourceTypes.addSourceTypeSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addSourceType.isLoading }));
  }, [addSourceType.isLoading]);

  const deleteSourceType = useMutation((id: number) =>
    DeleteSourceType(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('sourceTypes.deleteSourceTypeSuccessMessage')} type={`success`} showIcon />,
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
      deleteSourceType.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteSourceType.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteSourceType.isLoading }));
  }, [deleteSourceType.isLoading]);

  const editSourceType = useMutation((data: SourceTypeModel) => UpdateSourceType(data));

  const handleEdit = (data: SourceTypeModel, id: number) => {
    editSourceType
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`sourceTypes.editSourceTypeSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editSourceType.isLoading }));
  }, [editSourceType.isLoading]);

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [page, pageSize, language, refetch]);

  useEffect(() => {
    if (page > 1 && Data?.length === 0) setPage(1);
  }, [page, Data]);

  const columns = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header>{t('common.name')}</Header>, dataIndex: 'name' },
    {
      title: <Header>{t('common.icon')}</Header>,
      dataIndex: ['icon', 'url'],
      render: (url: string, record: sourceTypes) => {
        return (
          <>
            <Image
              src={url}
              onClick={() => {
                setIsOpenSliderImage(true);
                setAttachmentData(record);
              }}
            />
          </>
        );
      },
    },
    {
      title: <Header>{t('sourceTypes.attributeForSource')}</Header>,
      dataIndex: 'attributeForSource',
      render: (index: number, record: sourceTypes) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/attributeForSource`, { state: record.title });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('sourceTypes.attributeForSource')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: SourceTypeModel) => {
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
        id="sourceTypes"
        title={t('sourceTypes.sourceTypesList')}
        padding={
          Data === undefined || Data?.length === 0 || (page === 1 && totalCount <= pageSize)
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
            onClick={() => handleModalOpen('add')}
          >
            <CreateButtonText>{t('sourceTypes.addSourceType')}</CreateButtonText>
          </Button>

          {/*    ADD    */}
          {modalState.add && (
            <AddSourceType
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                addSourceType.mutateAsync(info);
              }}
              isLoading={addSourceType.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditSourceType
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editSourceType.isLoading}
              iconId={editmodaldata?.icon !== undefined ? editmodaldata?.icon.id : 0}
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
              title={t('sourceTypes.deleteSourceTypeModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('sourceTypes.deleteSourceTypeModalDescription')}
              isDanger={true}
              isLoading={deleteSourceType.isLoading}
            />
          )}

          {/* Image */}
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
                src={attachmentData?.icon !== undefined ? attachmentData?.icon.url : ''}
                size={isDesktop || isTablet ? 'small' : isMobile ? 'x_small' : mobileOnly ? 'xx_small' : 'x_small'}
              />
            </Modal>
          ) : null}
        </Row>
        <Table
          dataSource={Data}
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          pagination={{
            showSizeChanger: true,
            onChange: (page: number, pageSize: number) => {
              setPage(page);
              setPageSize(pageSize);
            },
            responsive: true,
            current: page,
            pageSize: pageSize,
            showTitle: false,
            showLessItems: true,
            showQuickJumper: true,
            total: totalCount || 0,
            pageSizeOptions: [5, 10, 15, 20],
            hideOnSinglePage: true,
          }}
          loading={loading}
          scroll={{ x: isTablet || isMobile ? 850 : '' }}
        />
      </Card>
    </>
  );
};
