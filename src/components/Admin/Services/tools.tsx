import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Row, Space, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { getAllTools, createTool, DeleteTool, UpdateTool } from '@app/services/tools';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { Attachment, SourceTypeModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { EditOutlined, DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddTool } from '@app/components/modal/AddTool';
import { EditTool } from '@app/components/modal/EditTool';
import { Image as AntdImage } from '@app/components/common/Image/Image';
import { useNavigate, useParams } from 'react-router-dom';
import { FONT_WEIGHT } from '@app/styles/themes/constants';
import { TableButton, Header, Modal, Image, TextBack, CreateButtonText } from '../../GeneralStyles';
import { number } from 'echarts';

export type tools = {
  id: number;
  title: string;
  description: string;
  attachment?: Attachment;
};

export const Tools: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { serviceId, subServiceId } = useParams();
  const { desktopOnly, mobileOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [attachmentData, setAttachmentData] = useState<tools>();
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<tools[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [dataSource, setDataSource] = useState<SourceTypeModel[] | undefined>(undefined);
  const [editmodaldata, setEditmodaldata] = useState<SourceTypeModel>();
  const [deletemodaldata, setDeletemodaldata] = useState<SourceTypeModel | undefined>(undefined);
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Tools', page, pageSize],
    () =>
      getAllTools(
        serviceId != undefined ? serviceId : '',
        subServiceId != undefined ? subServiceId : '',
        page,
        pageSize,
      )
        .then((data) => {
          const result = data?.data?.result?.items;
          setTotalCount(data?.data?.result?.totalCount);
          setData(result);
          setLoading(!data?.data?.success);
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
  }, [isDelete, isEdit, page, pageSize, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setRefetchOnAdd(false);
  }, [refetchOnAdd, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsActivate(false);
    setIsDeActivate(false);
  }, [isActivate, isDeActivate, refetch]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addTool = useMutation((data: SourceTypeModel) =>
    createTool(data)
      .then((data) => {
        notificationController.success({ message: t('tools.addToolSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addTool.isLoading }));
  }, [addTool.isLoading]);

  const deleteTool = useMutation((id: number) =>
    DeleteTool(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('tools.deleteToolSuccessMessage')} type={`success`} showIcon />,
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
      deleteTool.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteTool.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteTool.isLoading }));
  }, [deleteTool.isLoading]);

  const editTool = useMutation((data: SourceTypeModel) => UpdateTool(data));

  const handleEdit = (data: SourceTypeModel, id: number) => {
    editTool
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`tools.editToolSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editTool.isLoading }));
  }, [editTool.isLoading]);

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
      title: <Header>{t('common.attachment')}</Header>,
      dataIndex: ['attachment', 'url'],
      render: (url: string, record: tools) => {
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

            {/* <TableButton
              severity="error"
              onClick={() => {
                setDeletemodaldata(record);
                handleModalOpen('delete');
              }}
            >
              <DeleteOutlined />
            </TableButton> */}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        id="tools"
        title={t('tools.toolsList')}
        padding={
          Data === undefined || Data?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0rem'
        }
      >
        <Row justify={'end'}>
          {/*    ADD    */}
          {modalState.add && (
            <AddTool
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                const values = subServiceId ? { ...info, subServiceId } : { ...info, serviceId };
                addTool.mutateAsync(values);
              }}
              isLoading={addTool.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditTool
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => {
                const values = {
                  ...data,
                  subServiceId: subServiceId,
                };
                editmodaldata !== undefined && handleEdit(values, editmodaldata?.id);
              }}
              isLoading={editTool.isLoading}
              iconId={editmodaldata?.attachment !== undefined ? editmodaldata?.attachment?.id : 0}
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
              title={t('tools.deleteToolModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('tools.deleteToolModalDescription')}
              isDanger={true}
              isLoading={deleteTool.isLoading}
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
                src={attachmentData?.attachment !== undefined ? attachmentData?.attachment.url : ''}
                size={isDesktop || isTablet ? 'small' : isMobile ? 'x_small' : mobileOnly ? 'xx_small' : 'x_small'}
              />
            </Modal>
          ) : null}

          <>
            <Button
              type="primary"
              style={{
                margin: '1rem 1rem 1rem 0',
                width: 'auto',
                height: 'auto',
              }}
              onClick={() => handleModalOpen('add')}
            >
              <CreateButtonText>{t('tools.addTool')}</CreateButtonText>
            </Button>
            <Button
              style={{
                margin: '1rem 1rem 1rem 0',
                width: 'auto',
                height: 'auto',
              }}
              type="ghost"
              onClick={() => navigate(-1)}
              icon={<LeftOutlined />}
            >
              <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
            </Button>
          </>
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
