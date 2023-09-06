import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Popconfirm, Avatar } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';

import { Image as AntdImage } from '@app/components/common/Image/Image';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { getAllUsers, Create, Update, Delete, Activate, DeActivate } from '@app/services/users';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { defineColorBySeverity } from '@app/utils/utils';
import { CompanyModal, UserModel } from '@app/interfaces/interfaces';
import { Navigate, useNavigate } from 'react-router-dom';
import { Deletce, Updatce, getAllCompanies } from '@app/services/company';
import { LableText, Header, CreateButtonText, TableButton } from '../../GeneralStyles';
import { EditCompany } from '@app/components/modal/EditCompany';

export const Companies: React.FC = () => {
  const { t } = useTranslation();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<CompanyModal[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<CompanyModal | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<CompanyModal | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [attachmentData, setAttachmentData] = useState<CompanyModal>();

  const [isHover, setIsHover] = useState(false);
  const [refetchOnAddManager, setRefetchOnAddManager] = useState(false);
  const [managerStatus, setManagerStatus] = useState<boolean | undefined>(undefined);
  const [managerType, setManagerType] = useState<number | string>('');
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // handle button click logic
    navigate('/AddCompany', { replace: false });
  };
  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
    console.log(modalState);
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Users', page, pageSize, refetchOnAddManager, isDelete, isEdit, isActivate, isDeActivate, isAdmin, isEmployee],
    () =>
      getAllCompanies(page, pageSize)
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
  }, [isDelete, isEdit, managerStatus, managerType, page, pageSize, refetch]);

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

  // const addManager = useMutation((data: CompanyModal) =>
  //   Create(data)
  //     .then((data) => {
  //       notificationController.success({ message: t('managers.addManagerSuccessMessage') });
  //       setRefetchOnAddManager(data.data?.success);
  //     })
  //     .catch((error) => {
  //       notificationController.error({ message: error.message || error.error?.message });
  //     }),
  // );

  // useEffect(() => {
  //   setModalState((prevModalState) => ({ ...prevModalState, add: addManager.isLoading }));
  // }, [addManager.isLoading]);

  const deleteManager = useMutation((id: number) =>
    Deletce(id)
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
      deleteManager.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteManager.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteManager.isLoading }));
  }, [deleteManager.isLoading]);

  const activateManager = useMutation((id: number) =>
    Activate(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('managers.activateManagerSuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivateManager = useMutation((id: number) =>
    DeActivate(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('managers.deactivateManagerSuccessMessage')} type="success" showIcon />,
        });
        setIsDeActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="success" showIcon /> });
      }),
  );

  const editManager = useMutation((data: CompanyModal) => Updatce(data));

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

  // useEffect(() => {
  //   setModalState((prevModalState) => ({ ...prevModalState, delete: editManager.isLoading }));
  // }, [editManager.isLoading]);

  const TableText = styled.div`
    font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
  `;

  const columns = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header>{t('common.image')}</Header>,
      dataIndex: ['companyProfile', 'url'],
      render: (url: string, record: CompanyModal) => {
        return (
          <>
            <Avatar
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
    { title: <Header>{t('companies.name')}</Header>, dataIndex: 'name' },
    { title: <Header>{t('companies.Adress')}</Header>, dataIndex: 'address' },
    //{ title: <Header>{t('auth.dscription')}</Header>, dataIndex: 'bio' },
    {
      title: <Header>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: CompanyModal) => {
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

            {record.isActive === true ? (
              <Popconfirm
                placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                title={<LableText>{t('companies.deactivateManagerConfirm')}</LableText>}
                okButtonProps={{
                  onMouseOver: () => {
                    setIsHover(true);
                  },
                  onMouseLeave: () => {
                    setIsHover(false);
                  },
                  loading: false,
                  style: {
                    color: `${defineColorBySeverity('info')}`,
                    background: isHover
                      ? 'var(--background-color)'
                      : `rgba(${defineColorBySeverity('info', true)}, 0.04)`,
                    borderColor: isHover
                      ? `${defineColorBySeverity('info')}`
                      : `rgba(${defineColorBySeverity('info', true)}, 0.9)`,
                  },
                }}
                okText={
                  <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
                    {deActivateManager.isLoading ? (
                      <>
                        {t(`common.deactivate`)} <LoadingOutlined />
                      </>
                    ) : (
                      t(`common.deactivate`)
                    )}
                  </div>
                }
                cancelText={
                  <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>{t(`common.cancel`)}</div>
                }
                // onConfirm={() => deActivateManager.mutateAsync(record.id)}
              >
                <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                  <TableText>{t('common.deactivate')}</TableText>
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                title={<LableText>{t('companies.activateManagerConfirm')}</LableText>}
                okButtonProps={{
                  onMouseOver: () => {
                    setIsHover(true);
                  },
                  onMouseLeave: () => {
                    setIsHover(false);
                  },
                  loading: false,
                  style: {
                    color: `${defineColorBySeverity('info')}`,
                    background: isHover
                      ? 'var(--background-color)'
                      : `rgba(${defineColorBySeverity('info', true)}, 0.04)`,
                    borderColor: isHover
                      ? `${defineColorBySeverity('info')}`
                      : `rgba(${defineColorBySeverity('info', true)}, 0.9)`,
                  },
                }}
                okText={
                  <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
                    {activateManager.isLoading ? (
                      <>
                        {t(`common.activate`)} <LoadingOutlined />
                      </>
                    ) : (
                      t(`common.activate`)
                    )}
                  </div>
                }
                cancelText={
                  <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>{t(`common.cancel`)}</div>
                }
                //  onConfirm={() => activateManager.mutateAsync(record.id)}
              >
                <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                  <TableText>{t('common.activate')}</TableText>
                </Button>
              </Popconfirm>
            )}
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

          {/*    ADD    */}
          {/* {modalState.add && (
            <AddCompany
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreateCompany={(CompanyInfo) => {
                //addManager.mutateAsync(CompanyInfo);
              }}
              //isLoading={addManager.isLoading}
            />
          )} */}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditCompany
              Company_values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id!)}
              isLoading={editManager.isLoading}
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
              title={t('companies.deletecompanyModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('companies.deletecompanyModalDescription')}
              isDanger={true}
              isLoading={deleteManager.isLoading}
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
