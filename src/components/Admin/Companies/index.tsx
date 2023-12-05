import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Tag, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import {
  EditOutlined,
  DeleteOutlined,
  ApartmentOutlined,
  CheckOutlined,
  CloseOutlined,
  TagOutlined,
  TeamOutlined,
  SnippetsOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { CompanyModal, CompanyProfile } from '@app/interfaces/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DeleteCompany,
  updateCompany,
  getAllCompanies,
  confirmCompany,
  ChangeAcceptRequestOrPossibleRequestForCompany,
} from '@app/services/companies';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Image as AntdImage } from '@app/components/common/Image/Image';
import { TableButton, Header, Modal, Image, CreateButtonText, TextBack } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { ChangeAcceptRequestOrPotentialClient } from '@app/components/modal/ChangeAcceptRequestOrPotentialClient';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';

interface CompanyRecord {
  id: number;
  isFeature: boolean;
}

export const Companies: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { language } = useLanguage();
  const { desktopOnly, isTablet, isMobile, isDesktop, mobileOnly } = useResponsive();
  const { type, requestId } = useParams();

  const [modalState, setModalState] = useState({
    edit: false,
    delete: false,
    approve: false,
    reject: false,
    acceptRequestOrPotentialClient: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<CompanyModal[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [deletemodaldata, setDeletemodaldata] = useState<CompanyModal | undefined>(undefined);
  const [acceptRequestOrPotentialClientmodaldata, setAcceptRequestOrPotentialClientmodaldata] = useState<any>();
  const [approvemodaldata, setApprovemodaldata] = useState<CompanyModal | undefined>(undefined);
  const [rejectmodaldata, setRejectmodaldata] = useState<CompanyModal | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [attachmentData, setAttachmentData] = useState<CompanyProfile>();
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);

  const handleButtonClick = () => {
    Navigate('/addCompany', { replace: false });
  };
  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['AllCompanies', page, pageSize, isDelete, isEdit, isApproved, isChanged, isRejected],
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
      enabled: dataSource === undefined && type === undefined && requestId === undefined,
    },
  );

  const allCompanies = useQuery(
    ['AllCompanies', page, pageSize, isDelete, isEdit, isApproved, isChanged, isRejected],
    () =>
      getAllCompanies(page, pageSize, searchString, type, requestId)
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
      enabled: type !== undefined && requestId !== undefined,
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
  }, [isDelete, isEdit, isApproved, isChanged, isRejected, page, pageSize, language, searchString, refetch]);

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

  const acceptRequestOrPotentialClient = useMutation((data: any) =>
    ChangeAcceptRequestOrPossibleRequestForCompany(data)
      .then((data) => {
        data.data?.success &&
          (setIsChanged(data.data?.success),
          message.open({
            content: (
              <Alert message={t('companies.acceptRequestOrPotentialClientSuccessMessage')} type={`success`} showIcon />
            ),
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleAcceptRequestOrPotentialClient = (data: any, id: number) => {
    acceptRequestOrPotentialClient.mutateAsync({ ...data, id });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({
      ...prevModalState,
      acceptRequestOrPotentialClient: acceptRequestOrPotentialClient.isLoading,
    }));
  }, [acceptRequestOrPotentialClient.isLoading]);

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
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.image')}</Header>,
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
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>, dataIndex: 'name' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.serviceType')}</Header>,
      dataIndex: 'serviceType',
      render: (record: number) => {
        return (
          <>
            {record == 0
              ? '___'
              : record == 1
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
    type === undefined &&
      requestId === undefined && {
        title: <Header style={{ wordBreak: 'normal' }}>{t('requests.offers')}</Header>,
        dataIndex: 'offers',
        render: (index: number, record: any) => {
          return (
            <Space>
              <Button
                disabled={record.statues !== 2}
                style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
                severity="info"
                onClick={() => {
                  Navigate(`${record.id}/offers`, { state: record.name });
                }}
              >
                <div
                  style={{
                    fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                    fontWeight: FONT_WEIGHT.regular,
                    width: 'auto',
                  }}
                >
                  {t('requests.offers')}
                </div>
              </Button>
            </Space>
          );
        },
      },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.status')}</Header>,
      dataIndex: 'status',
      render: (index: number, record: CompanyModal) => {
        return (
          <>
            {(record.statues === 0 || record.statues === 1) && (
              <Space>
                <Tooltip placement="top" title={t('common.approve')}>
                  <TableButton
                    severity="info"
                    onClick={() => {
                      setApprovemodaldata(record);
                      handleModalOpen('approve');
                    }}
                  >
                    <CheckOutlined />
                  </TableButton>
                </Tooltip>

                <Tooltip placement="top" title={t('common.reject')}>
                  <TableButton
                    severity="error"
                    onClick={() => {
                      setRejectmodaldata(record);
                      handleModalOpen('reject');
                    }}
                  >
                    <CloseOutlined />
                  </TableButton>
                </Tooltip>
              </Space>
            )}
            {record.statues === 2 && (
              <Tag key={record?.id} color="#01509a" style={{ padding: '4px' }}>
                {t('companies.approved')}
              </Tag>
            )}
            {record.statues === 3 && (
              <Tag key={record?.id} color="#ff5252" style={{ padding: '4px' }}>
                {t('companies.rejected')}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: any) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.details')}>
              <TableButton
                severity="success"
                onClick={() => {
                  Navigate(`${record.id}/details`, { state: record.name });
                }}
              >
                <TagOutlined />
              </TableButton>
            </Tooltip>

            {type === undefined && requestId === undefined && (
              <>
                <Tooltip placement="top" title={t('companies.ChangeAcceptRequestOrPotentialClient')}>
                  <TableButton
                    severity="info"
                    onClick={() => {
                      setAcceptRequestOrPotentialClientmodaldata(record);
                      handleModalOpen('acceptRequestOrPotentialClient');
                    }}
                  >
                    <SnippetsOutlined />
                  </TableButton>
                </Tooltip>

                <Tooltip placement="top" title={t('companies.branches')}>
                  <TableButton
                    severity="warning"
                    onClick={() => {
                      Navigate(`${record.id}/branches`, { replace: false });
                    }}
                  >
                    <ApartmentOutlined />
                  </TableButton>
                </Tooltip>

                <Tooltip placement="top" title={t('companies.possibleClients')}>
                  <TableButton
                    severity="success"
                    onClick={() => {
                      Navigate(`${record.id}/possibleClients`, { replace: false });
                    }}
                  >
                    <TeamOutlined />
                  </TableButton>
                </Tooltip>

                <Tooltip placement="top" title={t('common.edit')}>
                  <TableButton
                    severity="info"
                    onClick={() => {
                      Navigate(`${record.id}/EditCompany`, { replace: false });
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
              </>
            )}
          </Space>
        );
      },
    },
  ].filter(Boolean);

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
          {type !== undefined && requestId !== undefined && (
            <Btn
              style={{
                margin: '1rem 1rem 1rem 0',
                width: 'auto',
                height: 'auto',
              }}
              type="ghost"
              onClick={() => Navigate(-1)}
              icon={<LeftOutlined />}
            >
              <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
            </Btn>
          )}

          <Btn
            type="primary"
            style={{
              margin: '1rem 1rem 1rem 0',
              width: 'auto',
              height: 'auto',
            }}
            onClick={handleButtonClick}
          >
            <CreateButtonText>{t('companies.addCompany')}</CreateButtonText>
          </Btn>

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

          {/*    Accept Request Or Potential Clients    */}
          {modalState.acceptRequestOrPotentialClient && (
            <ChangeAcceptRequestOrPotentialClient
              visible={modalState.acceptRequestOrPotentialClient}
              onCancel={() => handleModalClose('acceptRequestOrPotentialClient')}
              onEdit={(info) => {
                acceptRequestOrPotentialClientmodaldata != undefined &&
                  handleAcceptRequestOrPotentialClient(info, acceptRequestOrPotentialClientmodaldata.id);
              }}
              isLoading={acceptRequestOrPotentialClient.isLoading}
              values={acceptRequestOrPotentialClientmodaldata}
              title="company"
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
          rowKey={(record: CompanyRecord) => record.id.toString()}
          rowClassName={(record: CompanyRecord) => (record.isFeature ? 'feature-row' : '')}
        />
      </Card>
    </>
  );
};
