import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { Broker, UserModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { EditBroker } from '@app/components/modal/EditBroker';
import { AddBrokr } from '@app/components/modal/AddBroker';
import { CreateM, DeleteM, Updatem, getAllM } from '../../../services/mediator';

export const Brokers: React.FC = () => {
  const { t } = useTranslation();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<UserModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<Broker | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<Broker | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [refetchOnAddManager, setRefetchOnAddManager] = useState(false);
  const [managerStatus, setManagerStatus] = useState<boolean | undefined>(undefined);
  const [managerType, setManagerType] = useState<number | string>('');

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
    console.log(modalState);
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Partner', page, pageSize, refetchOnAddManager, isDelete, isEdit, isActivate, isDeActivate, isAdmin, isEmployee],
    () =>
      getAllM(page, pageSize)
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

  const addManager = useMutation((data: Broker) =>
    CreateM(data)
      .then((data) => {
        notificationController.success({ message: t('Brokers.addPartnerSuccessMessage') });
        setRefetchOnAddManager(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addManager.isLoading }));
  }, [addManager.isLoading]);

  const deletePartner = useMutation((id: number) =>
    DeleteM(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('Brokers.deletePartnerSuccessMessage')} type={`success`} showIcon />,
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
      deletePartner.mutateAsync(id);
      setPage(page - 1);
    } else {
      deletePartner.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deletePartner.isLoading }));
  }, [deletePartner.isLoading]);

  // const activateManager = useMutation((id: number) =>
  //   ActivatePartner(id)
  //     .then((data) => {
  //       message.open({
  //         content: <Alert message={t('managers.activateManagerSuccessMessage')} type="success" showIcon />,
  //       });
  //       setIsActivate(data.data?.success);
  //     })
  //     .catch((error) => {
  //       message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
  //     }),
  // );

  // const deActivateManager = useMutation((id: number) =>
  //   DeActivatePartner(id)
  //     .then((data) => {
  //       message.open({
  //         content: <Alert message={t('managers.deactivatePartnerSuccessMessage')} type="success" showIcon />,
  //       });
  //       setIsDeActivate(data.data?.success);
  //     })
  //     .catch((error) => {
  //       message.open({ content: <Alert message={error.message || error.error?.message} type="success" showIcon /> });
  //     }),
  // );

  const editPartner = useMutation((data: Broker) => Updatem(data));

  const handleEdit = (data: Broker, id: number) => {
    editPartner
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`Brokers.editPartnerSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editPartner.isLoading }));
  }, [editPartner.isLoading]);

  const TableText = styled.div`
    font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
  `;

  const columns = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header>{t('Brokers.partnerPhoneNumber')}</Header>, dataIndex: 'mediatorPhoneNumber' },
    { title: <Header>{t('Brokers.partnercode')}</Header>, dataIndex: 'mediatorCode' },
    { title: <Header>{t('Brokers.partnerdiscountPercentage')}</Header>, dataIndex: 'commissionPercentage' },
    { title: <Header>{t('Brokers.mediatorProfit')}</Header>, dataIndex: 'mediatorProfit' },

    ,
    // {
    //   title: <Header>{t('Partners.PartnersStatus')}</Header>,
    //   dataIndex: 'isActive',
    //   render: (managerStatus: boolean) => {
    //     return <>{(managerStatus = managerStatus ? t('common.active') : t('common.inactive'))}</>;
    //   },
    //   filterDropdown: () => {
    //     const fontSize = isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs;
    //     return (
    //       <div style={{ padding: 8 }}>
    //         <RadioGroup
    //           size="small"
    //           onChange={(e: RadioChangeEvent) => {
    //             setTemp(e.target.value);
    //           }}
    //           value={temp}
    //         >
    //           <Radio style={{ display: 'block', fontSize }} value={true}>
    //             {t('common.active')}
    //           </Radio>
    //           <Radio style={{ display: 'block', fontSize }} value={false}>
    //             {t('common.inactive')}
    //           </Radio>
    //         </RadioGroup>
    //         <Row gutter={[5, 5]} style={{ marginTop: '.35rem' }}>
    //           <Col>
    //             <Button
    //               disabled={managerStatus === undefined ? true : false}
    //               style={{ fontSize, fontWeight: '400' }}
    //               size="small"
    //               onClick={() => {
    //                 setTemp(undefined); //true or false
    //                 setManagerStatus(undefined); //Active or InActive
    //               }}
    //             >
    //               {t('common.reset')}
    //             </Button>
    //           </Col>
    //           <Col>
    //             <Button
    //               size="small"
    //               type="primary"
    //               style={{ fontSize, fontWeight: '400' }}
    //               onClick={() => setManagerStatus(temp === false ? 'false' : temp)}
    //             >
    //               {t('common.apply')}
    //             </Button>
    //           </Col>
    //         </Row>
    //       </div>
    //     );
    //   },
    // },

    {
      title: <Header>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: Broker) => {
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

            {/* {record.isActive === true ? (
              <Popconfirm
                placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                title={<LableText>{t('managers.deactivateManagerConfirm')}</LableText>}
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
                onConfirm={() => deActivateManager.mutateAsync(record.id)}
              >
                <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                  <TableText>{t('common.deactivate')}</TableText>
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                title={<LableText>{t('managers.activateManagerConfirm')}</LableText>}
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
                onConfirm={() => activateManager.mutateAsync(record.id)}
              >
                <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                  <TableText>{t('common.activate')}</TableText>
                </Button>
              </Popconfirm>
            )} */}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('Brokers.BrokersList')}
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
            onClick={() => handleModalOpen('add')}
          >
            <CreateButtonText>{t('Brokers.addPartner')}</CreateButtonText>
          </Button>
          {/*    Add    */}
          {modalState.add && (
            <AddBrokr
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreateBroker={(BrokerInfo) => {
                addManager.mutateAsync(BrokerInfo);
              }}
              isLoading={addManager.isLoading}
            />
          )}
          {/*    EDIT    */}
          {modalState.edit && (
            <EditBroker
              Brokr_values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editPartner.isLoading}
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
              title={t('Brokers.deletePartnerModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              // description={t('managers.deleteManagerModalDescription')}
              isDanger={true}
              isLoading={deletePartner.isLoading}
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
