import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Tag } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, ApartmentOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { CompanyModal, CompanyProfile } from '@app/interfaces/interfaces';
import { useNavigate } from 'react-router-dom';
import { DeleteCompany, updateCompany, getAllCompanies, confirmCompany } from '@app/services/companies';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Image as AntdImage } from '@app/components/common/Image/Image';
import { TableButton, Header, Modal, Image, CreateButtonText } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';

export const Companies: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { desktopOnly, isTablet, isMobile, isDesktop, mobileOnly } = useResponsive();

  const [modalState, setModalState] = useState({
    edit: false,
    delete: false,
    approve: false,
    reject: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<CompanyModal[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<CompanyModal | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<CompanyModal | undefined>(undefined);
  const [approvemodaldata, setApprovemodaldata] = useState<CompanyModal | undefined>(undefined);
  const [rejectmodaldata, setRejectmodaldata] = useState<CompanyModal | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [attachmentData, setAttachmentData] = useState<CompanyProfile>();
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);

  const handleButtonClick = () => {
    navigate('/addCompany', { replace: false });
  };
  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['AllCompanies', page, pageSize, isDelete, isEdit, isApproved, isRejected],
    () =>
      getAllCompanies(page, pageSize, searchString)
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
  }, [isDelete, isEdit, isApproved, isRejected, page, pageSize, language, searchString, refetch]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const deleteCompany = useMutation((id: number) =>
    DeleteCompany(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('companies.deleteCompanySuccessMessage')} type={`success`} showIcon />,
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
      deleteCompany.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteCompany.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteCompany.isLoading }));
  }, [deleteCompany.isLoading]);

  const approveCompany = useMutation((data: any) =>
    confirmCompany(data)
      .then((data) => {
        data.data?.success &&
          (setIsApproved(data.data?.success),
          message.open({
            content: <Alert message={t('companies.approveCompanySuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleApprove = (id: any) => {
    const data = { companyId: id, statues: 2 };
    approveCompany.mutateAsync(data);
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, approve: approveCompany.isLoading }));
  }, [approveCompany.isLoading]);

  const rejectCompany = useMutation((data: any) =>
    confirmCompany(data)
      .then((data) => {
        data.data?.success &&
          (setIsRejected(data.data?.success),
          message.open({
            content: <Alert message={t('companies.rejectCompanySuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleReject = (id: any) => {
    const data = { companyId: id, statues: 3 };
    rejectCompany.mutateAsync(data);
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, reject: rejectCompany.isLoading }));
  }, [rejectCompany.isLoading]);

  const editManager = useMutation((data: CompanyModal) => updateCompany(data));

  const handleEdit = (data: CompanyModal, id: number) => {
    editManager
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`Companies.editeCompanySuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  const columns = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header>{t('common.image')}</Header>,
      dataIndex: ['companyProfile', 'url'],
      render: (url: string, record: CompanyModal) => {
        return (
          <>
            <Image
              src={url}
              onClick={() => {
                setIsOpenSliderImage(true);
                setAttachmentData(record?.companyProfile);
              }}
            />
          </>
        );
      },
    },
    { title: <Header>{t('common.name')}</Header>, dataIndex: 'name' },
    { title: <Header>{t('common.address')}</Header>, dataIndex: 'address' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.serviceType')}</Header>,
      dataIndex: 'serviceType',
      render: (record: number) => {
        return (
          <>
            {record == 1
              ? t('requests.Internal')
              : record == 2
              ? t('requests.External')
              : `${t('requests.Internal')} & ${t('requests.External')}`}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.numberOfTransfers')}</Header>,
      dataIndex: 'numberOfTransfers',
    },
    {
      title: <Header>{t('requests.services')}</Header>,
      dataIndex: 'services',
      render: (record: any) => (
        <Space style={{ display: 'grid' }}>
          {record?.map((service: any) => (
            <Tag key={service?.id} style={{ padding: '4px' }}>
              {service?.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: <Header>{t('requests.details')}</Header>,
      dataIndex: 'details',
      render: (index: number, record: any) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/details`, { state: record.name });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('requests.details')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header>{t('companies.status')}</Header>,
      dataIndex: 'status',
      render: (index: number, record: CompanyModal) => {
        return (
          <>
            {record.statues === 0 && (
              <Space>
                <TableButton
                  severity="info"
                  onClick={() => {
                    setApprovemodaldata(record);
                    handleModalOpen('approve');
                  }}
                >
                  <CheckOutlined />
                </TableButton>
                <TableButton
                  severity="error"
                  onClick={() => {
                    setRejectmodaldata(record);
                    handleModalOpen('reject');
                  }}
                >
                  <CloseOutlined />
                </TableButton>
              </Space>
            )}
            {record.statues === 1 && (
              <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
                Checking
              </Tag>
            )}
            {record.statues === 2 && (
              <Tag key={record?.id} color="#01509a" style={{ padding: '4px' }}>
                Approved
              </Tag>
            )}
            {record.statues === 3 && (
              <Tag key={record?.id} color="#ff5252" style={{ padding: '4px' }}>
                Rejected
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: <Header>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: CompanyModal) => {
        return (
          <Space>
            <TableButton
              severity="success"
              onClick={() => {
                // navigate(`${record.id}/addBranch`, { replace: false });
                navigate(`${record.id}/branches`, { replace: false });
              }}
            >
              <ApartmentOutlined />
            </TableButton>
            <TableButton
              severity="info"
              onClick={() => {
                // navigate(`${record.id}/EditCom`, { replace: false });
              }}
            >
              <EditOutlined />
            </TableButton>

            {/* <TableButton
              severity="info"
              onClick={() => {
                setEditmodaldata(record);
                handleModalOpen('edit');
              }}
            >
              <EditOutlined />
            </TableButton> */}

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
        title={t('companies.companiesList')}
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
            onClick={handleButtonClick}
          >
            <CreateButtonText>{t('companies.addCompany')}</CreateButtonText>
          </Button>

          {/*    EDIT    */}
          {/* {modalState.edit && (
            <EditCompany
              Company_values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id!)}
              isLoading={editManager.isLoading}
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
              title={t('companies.deletecompanyModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('companies.deletecompanyModalDescription')}
              isDanger={true}
              isLoading={deleteCompany.isLoading}
            />
          )}

          {/*    Approve    */}
          {modalState.approve && (
            <ActionModal
              visible={modalState.approve}
              onCancel={() => handleModalClose('approve')}
              onOK={() => {
                approvemodaldata !== undefined && handleApprove(approvemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('companies.approvecompanyModalTitle')}
              okText={t('common.approve')}
              cancelText={t('common.cancel')}
              description={t('companies.approvecompanyModalDescription')}
              // isDanger={true}
              isLoading={approveCompany.isLoading}
            />
          )}

          {/*    Reject    */}
          {modalState.reject && (
            <ActionModal
              visible={modalState.reject}
              onCancel={() => handleModalClose('reject')}
              onOK={() => {
                rejectmodaldata !== undefined && handleReject(rejectmodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('companies.rejectcompanyModalTitle')}
              okText={t('common.reject')}
              cancelText={t('common.cancel')}
              description={t('companies.rejectcompanyModalDescription')}
              // isDanger={true}
              isLoading={approveCompany.isLoading}
            />
          )}

          {/*    Image    */}
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
                src={attachmentData !== undefined ? attachmentData.url : ''}
                size={isDesktop || isTablet ? 'small' : isMobile ? 'x_small' : mobileOnly ? 'xx_small' : 'x_small'}
              />
            </Modal>
          ) : null}
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
