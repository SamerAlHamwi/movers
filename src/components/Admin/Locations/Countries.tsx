import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Col, Popconfirm, Row, Space, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import {
  getAllCountries,
  createCountry,
  Update,
  Delete,
  ActivationCountry,
  DeActivateCountry,
} from '@app/services/locations';
import { useNavigate } from 'react-router-dom';
import { Header, TableButton } from '../../GeneralStyles';
import { currentGamesPageAtom, gameStatusAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { CountryModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddCountry } from '@app/components/modal/AddCountry';
import { EditCountry } from '@app/components/modal/EditCountry';
import { Modal, Image, CreateButtonText } from '../../GeneralStyles';
import { LableText } from '../../GeneralStyles';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { defineColorBySeverity } from '@app/utils/utils';

export type countries = {
  id: number;
  name: string;
  description: string;
  countryStatus: number;
};

export const Country: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [countryPage, setCountryPage] = useAtom(currentGamesPageAtom);
  const [countryPageSize, setcountryPageSize] = useAtom(gamesPageSizeAtom);
  const [countryData, setCountryData] = useState<countries[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const navigate = useNavigate();
  const [temp, setTemp] = useState<any>();
  const [countryStatus, setCountryStatus] = useAtom(gameStatusAtom);
  const [isHover, setIsHover] = useState(false);
  const [isOpenAddModalForm, setIsOpenAddModalForm] = useState(false);
  const [isOpenDeleteModalForm, setIsOpenDeleteModalForm] = useState(false);
  const [isOpenEditModalForm, setIsOpenEditModalForm] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [dataSource, setDataSource] = useState<CountryModel[] | undefined>(undefined);
  const [editmodaldata, setEditmodaldata] = useState<CountryModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<CountryModel | undefined>(undefined);
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const { refetch, isRefetching } = useQuery(
    ['Countries', countryPage, countryPageSize],
    () =>
      getAllCountries(countryPage, countryPageSize, countryStatus)
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          setCountryData(result);
          setLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setLoading(false);
        }),
    {
      enabled: countryData === undefined,
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
  }, [isDelete, isEdit, countryStatus, countryPage, countryPageSize, refetch]);

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
    if (countryPage > 1 && dataSource?.length === 0) {
      setCountryPage(1);
    }
  }, [countryPage, dataSource]);

  const addCountry = useMutation((data: CountryModel) =>
    createCountry(data)
      .then((data) => {
        notificationController.success({ message: t('locations.addCountrySuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setIsOpenAddModalForm(addCountry.isLoading);
  }, [addCountry.isLoading]);

  const deleteCountry = useMutation((id: number) =>
    Delete(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('locations.deleteCountrySuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleDelete = (id: any) => {
    if (countryPage > 1 && dataSource?.length === 1) {
      deleteCountry.mutateAsync(id);
      setCountryPage(countryPage - 1);
    } else {
      deleteCountry.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenDeleteModalForm(deleteCountry.isLoading);
  }, [deleteCountry.isLoading]);

  const activateCountry = useMutation((id: number) =>
    ActivationCountry(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('locations.activateCountrySuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivateCountry = useMutation((id: number) =>
    DeActivateCountry(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('locations.deactivateCountrySuccessMessage')} type="success" showIcon />,
        });
        setIsDeActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="success" showIcon /> });
      }),
  );

  const editCountry = useMutation((data: CountryModel) => Update(data));

  const handleEdit = (data: CountryModel, id: number) => {
    editCountry
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`locations.editCountrySuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setIsOpenEditModalForm(editCountry.isLoading);
  }, [editCountry.isLoading]);

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [countryStatus, countryPage, countryPageSize, language, refetch]);

  useEffect(() => {
    if (countryPage > 1 && countryData?.length === 0) setCountryPage(1);
  }, [countryPage, countryData]);

  const TableText = styled.div`
    font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
  `;

  const columns = [
    { title: <Header>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header>{t('common.name')}</Header>, dataIndex: 'name' },
    { title: <Header>{t('locations.dialCode')}</Header>, dataIndex: 'dialCode' },
    {
      title: <Header>{t('locations.countryStatus')}</Header>,
      dataIndex: 'isActive',
      render: (countryStatus: boolean) => {
        return <>{(countryStatus = countryStatus ? t('common.active') : t('common.inactive'))}</>;
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
                  disabled={countryStatus === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined); //true or false
                    setCountryStatus(undefined); //Active or InActive
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
                  onClick={() => setCountryStatus(temp === false ? 'false' : temp)}
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
      title: <Header>{t('locations.cities')}</Header>,
      dataIndex: 'cities',
      render: (index: number, record: countries) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/cities`, { state: record.name });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('locations.cities')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: CountryModel) => {
        return (
          <Space>
            <TableButton
              severity="info"
              onClick={() => {
                setEditmodaldata(record);
                setIsOpenEditModalForm(true);
              }}
            >
              <EditOutlined />
            </TableButton>

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
                title={<LableText>{t('locations.deactivateCountryConfirm')}</LableText>}
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
                    {deActivateCountry.isLoading ? (
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
                onConfirm={() => deActivateCountry.mutateAsync(record.id)}
              >
                <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                  <TableText>{t('common.deactivate')}</TableText>
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                title={<LableText>{t('locations.activateCountryConfirm')}</LableText>}
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
                    {activateCountry.isLoading ? (
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
                onConfirm={() => activateCountry.mutateAsync(record.id)}
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
        id="countries"
        title={t('locations.countriesList')}
        padding={
          countryData === undefined || countryData?.length === 0 || (countryPage === 1 && totalCount <= countryPageSize)
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
            onClick={() => setIsOpenAddModalForm(true)}
          >
            <CreateButtonText>{t('locations.addCountry')}</CreateButtonText>
          </Button>

          {/*    ADD    */}
          {isOpenAddModalForm && (
            <AddCountry
              visible={isOpenAddModalForm}
              onCancel={() => setIsOpenAddModalForm(false)}
              onCreateCountry={(countryInfo) => {
                addCountry.mutateAsync(countryInfo);
              }}
              isLoading={addCountry.isLoading}
            />
          )}

          {/*    EDIT    */}
          {isOpenEditModalForm && (
            <EditCountry
              country_values={editmodaldata}
              visible={isOpenEditModalForm}
              onCancel={() => setIsOpenEditModalForm(false)}
              onEdit={(data: any) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editCountry.isLoading}
            />
          )}

          {/*    Delete    */}
          {isOpenDeleteModalForm && (
            <ActionModal
              visible={isOpenDeleteModalForm}
              onCancel={() => setIsOpenDeleteModalForm(false)}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('locations.deleteCountryModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('locations.deleteCountryModalDescription')}
              isDanger={true}
              isLoading={deleteCountry.isLoading}
            />
          )}
        </Row>
        <Table
          dataSource={countryData}
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          // columns={columns}
          pagination={{
            showSizeChanger: true,
            onChange: (countryPage: number, countryPageSize: number) => {
              setCountryPage(countryPage);
              setcountryPageSize(countryPageSize);
            },
            responsive: true,
            current: countryPage,
            pageSize: countryPageSize,
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
