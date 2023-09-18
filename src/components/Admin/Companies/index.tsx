import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Avatar } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, ApartmentOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { Activate, DeActivate } from '@app/services/users';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { CompanyModal } from '@app/interfaces/interfaces';
import { useNavigate } from 'react-router-dom';
import { Deletce, Updatce, getAllCompanies } from '@app/services/company';
import { Header, CreateButtonText, TableButton } from '../../GeneralStyles';
import { EditCompany } from '@app/components/modal/EditCompany';

export const Companies: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [modalState, setModalState] = useState({
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
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [refetchOnAddManager, setRefetchOnAddManager] = useState(false);
  const [managerStatus, setManagerStatus] = useState<boolean | undefined>(undefined);
  const [managerType, setManagerType] = useState<number | string>('');
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);

  const handleButtonClick = () => {
    navigate('/addCompany', { replace: false });
  };
  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
    console.log(modalState);
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    [
      'AllCompanies',
      page,
      pageSize,
      refetchOnAddManager,
      isDelete,
      isEdit,
      isActivate,
      isDeActivate,
      isAdmin,
      isEmployee,
    ],
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

  useEffect(() => {
    setLoading(true);
    refetch();
    setRefetchOnAdd(false);
  }, [refetchOnAdd, refetch]);

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
              }}
            />
          </>
        );
      },
    },
    { title: <Header>{t('companies.name')}</Header>, dataIndex: 'name' },
    { title: <Header>{t('companies.Adress')}</Header>, dataIndex: 'address' },
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
