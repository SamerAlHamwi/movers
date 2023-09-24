import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Popconfirm, Col } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { useQuery, useMutation } from 'react-query';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { getAllUsers, Delete, Activate, DeActivate } from '@app/services/users';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { LableText } from '../../GeneralStyles';
import { defineColorBySeverity } from '@app/utils/utils';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { UserModel } from '@app/interfaces/interfaces';
import { Dates } from '@app/constants/Dates';
import { Header, TableButton } from '../../GeneralStyles';
import { Button } from '@app/components/common/buttons/Button/Button';
import { ActionModal } from '@app/components/modal/ActionModal';
import { useLanguage } from '@app/hooks/useLanguage';

export const User: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [page, setPage] = useState<number>(1);
  const [dataSource, setDataSource] = useState<UserModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();
  const [isOpenDeleteModalForm, setIsOpenDeleteModalForm] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [deletemodaldata, setDeletemodaldata] = useState<UserModel | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [refetchOnAddUser, setRefetchOnAddUser] = useState(false);
  const [temp, setTemp] = useState<any>();
  const [userStatus, setUserStatus] = useState<boolean | undefined>(undefined);
  const [userType, setUserType] = useState<number | string>('');

  const { refetch, isRefetching } = useQuery(
    ['Users', page, pageSize, refetchOnAddUser, isDelete, isEdit, isActivate, isDeActivate],
    () =>
      getAllUsers(page, pageSize, false, true, userType, userStatus)
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
  }, [isDelete, isEdit, userStatus, page, pageSize, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setRefetchOnAddUser(false);
  }, [refetchOnAddUser, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsActivate(false);
    setIsDeActivate(false);
  }, [isActivate, isDeActivate, userType, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [page, pageSize, language, refetch]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const deleteUser = useMutation((id: number) =>
    Delete(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('users.deleteUserSuccessMessage')} type={`success`} showIcon />,
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
      deleteUser.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteUser.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenDeleteModalForm(deleteUser.isLoading);
  }, [deleteUser.isLoading]);

  const activateUser = useMutation((id: number) =>
    Activate(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('users.activateUserSuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivateUser = useMutation((id: number) =>
    DeActivate(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('users.deactivateUserSuccessMessage')} type="success" showIcon />,
        });
        setIsDeActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="success" showIcon /> });
      }),
  );

  const TableText = styled.div`
    font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
  `;

  const columns = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header>{t('users.userName')}</Header>, dataIndex: 'userName' },
    { title: <Header>{t('users.userFullName')}</Header>, dataIndex: 'fullName' },
    { title: <Header>{t('auth.email')}</Header>, dataIndex: 'emailAddress' },
    {
      title: <Header>{t('common.creationTime')}</Header>,
      dataIndex: 'creationTime',
      render: (creationTime: string) => {
        return <>{Dates.format(creationTime, 'DD MMMM YYYY, h:mm a')}</>;
      },
    },
    {
      title: <Header>{t('users.userStatus')}</Header>,
      dataIndex: 'isActive',
      render: (userStatus: boolean) => {
        return <>{(userStatus = userStatus ? t('common.active') : t('common.inactive'))}</>;
      },
      filterDropdown: () => {
        const fontSize = isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs;
        return (
          <div style={{ padding: 8 }}>
            <RadioGroup
              size="small"
              onChange={(e: RadioChangeEvent) => {
                setTemp(e.target.value);
              }}
              value={temp}
            >
              <Radio style={{ display: 'block', fontSize }} value={true}>
                {t('common.active')}
              </Radio>
              <Radio style={{ display: 'block', fontSize }} value={false}>
                {t('common.inactive')}
              </Radio>
            </RadioGroup>
            <Row gutter={[5, 5]} style={{ marginTop: '.35rem' }}>
              <Col>
                <Button
                  disabled={userStatus === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined);
                    setUserStatus(undefined);
                  }}
                >
                  {t('common.reset')}
                </Button>
              </Col>
              <Col>
                <Button
                  size="small"
                  type="primary"
                  style={{ fontSize, fontWeight: '400' }}
                  onClick={() => setUserStatus(temp === false ? 'false' : temp)}
                >
                  {t('common.apply')}
                </Button>
              </Col>
            </Row>
          </div>
        );
      },
    },
    {
      title: <Header>{t('users.usertype')}</Header>,
      dataIndex: 'type',
      render: (userType: number) => {
        return (
          <>
            {userType === 3 ? t('common.company') : t('common.user')}{' '}
            {console.log('userType', userType, 'userType', userType)}
          </>
        );
      },
      filterDropdown: () => {
        const fontSize = isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs;
        return (
          <div style={{ padding: 8 }}>
            <RadioGroup
              size="small"
              onChange={(e: RadioChangeEvent) => {
                setTemp(e.target.value);
              }}
              value={temp}
            >
              <Radio style={{ display: 'block', fontSize }} value={2}>
                {t('common.user')}
              </Radio>
              <Radio style={{ display: 'block', fontSize }} value={3}>
                {t('common.company')}
              </Radio>
            </RadioGroup>
            <Row gutter={[5, 5]} style={{ marginTop: '.35rem' }}>
              <Col>
                <Button
                  // disabled={userType === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined);
                    setUserType('');
                  }}
                >
                  {t('common.reset')}
                </Button>
              </Col>
              <Col>
                <Button
                  size="small"
                  type="primary"
                  style={{ fontSize, fontWeight: '400' }}
                  onClick={() => setUserType(temp === 2 ? 2 : 3)}
                >
                  {t('common.apply')}
                </Button>
              </Col>
            </Row>
          </div>
        );
      },
    },
    {
      title: <Header>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: UserModel) => {
        return (
          <Space>
            <TableButton
              severity="error"
              onClick={() => {
                setDeletemodaldata(record);
                setIsOpenDeleteModalForm(true);
              }}
            >
              <DeleteOutlined />
            </TableButton>

            {record.isActive === true ? (
              <Popconfirm
                placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                title={<LableText>{t('users.deactivateUserConfirm')}</LableText>}
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
                    {deActivateUser.isLoading ? (
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
                onConfirm={() => deActivateUser.mutateAsync(record.id)}
              >
                <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                  <TableText>{t('common.deactivate')}</TableText>
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                title={<LableText>{t('users.activateUserConfirm')}</LableText>}
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
                    {activateUser.isLoading ? (
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
                onConfirm={() => activateUser.mutateAsync(record.id)}
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
        title={t('users.usersList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row justify={'end'}>
          {/*    Delete    */}
          {isOpenDeleteModalForm && (
            <ActionModal
              visible={isOpenDeleteModalForm}
              onCancel={() => setIsOpenDeleteModalForm(false)}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('users.deleteUserModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('users.deleteUserModalDescription')}
              isDanger={true}
              isLoading={deleteUser.isLoading}
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
            // showTotal: (total) => `Total ${total} managers`,
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
