import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Row, Space, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { getAllServices, createService, DeleteService, UpdateService } from '@app/services/services';
import { useNavigate } from 'react-router-dom';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { Attachment, ServiceModel, translation } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddService } from '@app/components/modal/AddService';
import { EditService } from '@app/components/modal/EditService';
import { Image as AntdImage } from '@app/components/common/Image/Image';
import { TableButton, Header, Modal, Image, CreateButtonText } from '../../GeneralStyles';
import { useSelector } from 'react-redux';

export type services = {
  id: number;
  name: string;
  description: string;
  attachment?: Attachment;
  subServices: string[];
  tools: string[];
};

export const Services: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { mobileOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [attachmentData, setAttachmentData] = useState<services>();
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<services[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refetchOnAddService, setRefetchOnAddService] = useState(false);
  const [dataSource, setDataSource] = useState<ServiceModel[] | undefined>(undefined);
  const [editmodaldata, setEditmodaldata] = useState<ServiceModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<ServiceModel | undefined>(undefined);
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
    console.log(modalState);
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Services', page, pageSize],
    () =>
      getAllServices(page, pageSize, searchString)
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
    setRefetchOnAddService(false);
  }, [isDelete, isEdit, refetchOnAddService, page, pageSize, searchString, refetch]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addService = useMutation((data: ServiceModel) =>
    createService(data)
      .then((data) => {
        notificationController.success({ message: t('services.addServiceSuccessMessage') });
        setRefetchOnAddService(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addService.isLoading }));
  }, [addService.isLoading]);

  const deleteService = useMutation((id: number) =>
    DeleteService(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('services.deleteServiceSuccessMessage')} type={`success`} showIcon />,
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
      deleteService.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteService.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteService.isLoading }));
  }, [deleteService.isLoading]);

  const editService = useMutation((data: ServiceModel) => UpdateService(data));

  const handleEdit = (data: ServiceModel, id: number) => {
    editService
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`services.editServiceSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editService.isLoading }));
  }, [editService.isLoading]);

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
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>, dataIndex: 'name' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.image')}</Header>,
      dataIndex: ['attachment', 'url'],
      render: (url: string, record: services) => {
        return (
          <>
            <Image
              src={url}
              onClick={() => {
                setIsOpenSliderImage(true);
                setAttachmentData(record);

                console.log(record);
              }}
            />
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('services.subServices')}</Header>,
      dataIndex: 'subService',
      render: (index: number, record: services) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/subService`, { state: record.name });
              }}
              disabled={record?.tools?.length > 0}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('services.subServices')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: ServiceModel) => {
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
        id="services"
        title={t('services.servicesList')}
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
            <CreateButtonText>{t('services.addService')}</CreateButtonText>
          </Button>

          {/*    ADD    */}
          {modalState.add && (
            <AddService
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreateService={(info) => {
                addService.mutateAsync(info);
              }}
              isLoading={addService.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditService
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data: any) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editService.isLoading}
              AttachmentId={editmodaldata?.attachment !== undefined ? editmodaldata?.attachment.id : 0}
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
              title={t('services.deleteServiceModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('services.deleteServiceModalDescription')}
              isDanger={true}
              isLoading={deleteService.isLoading}
            />
          )}
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
                src={attachmentData?.attachment !== undefined ? attachmentData?.attachment.url : ''}
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
