import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, message, Popconfirm, Row, Space, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import {
  getAllPoints,
  CreatePoint,
  DeletePoint,
  UpdatePoint,
  ActivatePoint,
  DeActivatePoint,
} from '@app/services/points';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText, LableText } from '../../GeneralStyles';
import { Config } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { AddPoint } from '@app/components/modal/AddPoint';
import { EditPoint } from '@app/components/modal/EditPoint';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { defineColorBySeverity } from '@app/utils/utils';
import styled from 'styled-components';
import { GetEmailSetting, UpdateEmailSetting } from '@app/services/configurations';
import { EditEmailSetting } from '@app/components/modal/EditEmailSetting';

export const EmailSetting: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();

  const [modalState, setModalState] = useState({
    edit: false,
  });
  const [emailData, setEmailData] = useState<Config | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<Config | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  //   const TableText = styled.div`
  //     font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
  //     font-weight: ${FONT_WEIGHT.regular};
  //   `;

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Points'],
    () =>
      GetEmailSetting()
        .then((data) => {
          const result = data.data?.result;
          setEmailData(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: emailData === undefined,
    },
  );

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsEdit(false);
  }, [isEdit, refetch, language]);

  //   useEffect(() => {
  //     if (page > 1 && emailData?.length === 0) {
  //       setPage(1);
  //     }
  //   }, [page, emailData]);

  //   const addPoint = useMutation((data: any) =>
  //     CreatePoint(data)
  //       .then((data) => {
  //         notificationController.success({ message: t('points.addPointSuccessMessage') });
  //         setRefetchOnAdd(data.data?.success);
  //       })
  //       .catch((error) => {
  //         notificationController.error({ message: error.message || error.error?.message });
  //       }),
  //   );

  //   useEffect(() => {
  //     setModalState((prevModalState) => ({ ...prevModalState, add: addPoint.isLoading }));
  //   }, [addPoint.isLoading]);

  //   const deletePoint = useMutation((id: number) =>
  //     DeletePoint(id)
  //       .then((data) => {
  //         data.data?.success &&
  //           (setIsDelete(data.data?.success),
  //           message.open({
  //             content: <Alert message={t('points.deletePointSuccessMessage')} type={`success`} showIcon />,
  //           }));
  //       })
  //       .catch((error) => {
  //         message.open({
  //           content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
  //         });
  //       }),
  //   );

  //   const handleDelete = (id: any) => {
  //     if (page > 1 && emailData?.length === 1) {
  //       deletePoint.mutateAsync(id);
  //       setPage(page - 1);
  //     } else {
  //       deletePoint.mutateAsync(id);
  //     }
  //   };

  //   useEffect(() => {
  //     setModalState((prevModalState) => ({ ...prevModalState, delete: deletePoint.isLoading }));
  //   }, [deletePoint.isLoading]);

  const editEmailSetting = useMutation((data: Config) => UpdateEmailSetting(data));

  const handleEdit = (data: Config) => {
    editEmailSetting
      .mutateAsync({ ...data })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`points.editPointSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editEmailSetting.isLoading }));
  }, [editEmailSetting.isLoading]);

  //   const activateBundle = useMutation((id: number) =>
  //     ActivatePoint(id)
  //       .then((data) => {
  //         message.open({
  //           content: <Alert message={t('points.activatePartnerSuccessMessage')} type="success" showIcon />,
  //         });
  //         setIsActivate(data.data?.success);
  //       })
  //       .catch((error) => {
  //         message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
  //       }),
  //   );

  //   const deActivateBundle = useMutation((id: number) =>
  //     DeActivatePoint(id)
  //       .then((data) => {
  //         message.open({
  //           content: <Alert message={t('points.deactivatePartnerSuccessMessage')} type="success" showIcon />,
  //         });
  //         setIsDeActivate(data.data?.success);
  //       })
  //       .catch((error) => {
  //         message.open({ content: <Alert message={error.message || error.error?.message} type="success" showIcon /> });
  //       }),
  //   );

  //   const columns = [
  //     { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
  //     {
  //       title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>,
  //       dataIndex: 'name',
  //       render: (name: Config) => {
  //         return <>{name}</>;
  //       },
  //     },
  //     {
  //       title: <Header style={{ wordBreak: 'normal' }}>{t('points.numberOfPoint')}</Header>,
  //       dataIndex: 'numberOfPoint',
  //       render: (numberOfPoint: Config) => {
  //         return <>{numberOfPoint}</>;
  //       },
  //     },
  //     {
  //       title: <Header style={{ wordBreak: 'normal' }}>{t('points.price')}</Header>,
  //       dataIndex: 'price',
  //       render: (price: Config) => {
  //         return <>{price}</>;
  //       },
  //     },
  //     {
  //       title: <Header style={{ wordBreak: 'normal' }}>{t('points.bundleStatus')}</Header>,
  //       dataIndex: 'isActive',
  //       render: (bundleStatus: boolean) => {
  //         return <>{(bundleStatus = bundleStatus ? t('common.active') : t('common.inactive'))}</>;
  //       },
  //       filterDropdown: () => {
  //         const fontSize = isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs;
  //         return (
  //           <div style={{ padding: 8 }}>
  //             <RadioGroup
  //               size="small"
  //               onChange={(e: RadioChangeEvent) => {
  //                 setTemp(e.target.value);
  //               }}
  //               value={temp}
  //             >
  //               <Radio style={{ display: 'block', fontSize }} value={true}>
  //                 {t('common.active')}
  //               </Radio>
  //               <Radio style={{ display: 'block', fontSize }} value={false}>
  //                 {t('common.inactive')}
  //               </Radio>
  //             </RadioGroup>
  //             <Row gutter={[5, 5]} style={{ marginTop: '.35rem' }}>
  //               <Col>
  //                 <Button
  //                   disabled={bundleStatus === undefined ? true : false}
  //                   style={{ fontSize, fontWeight: '400' }}
  //                   size="small"
  //                   onClick={() => {
  //                     setTemp(undefined);
  //                     setBundleStatus(undefined);
  //                   }}
  //                 >
  //                   {t('common.reset')}
  //                 </Button>
  //               </Col>
  //               <Col>
  //                 <Button
  //                   size="small"
  //                   type="primary"
  //                   style={{ fontSize, fontWeight: '400' }}
  //                   onClick={() => setBundleStatus(temp === false ? 'false' : temp)}
  //                 >
  //                   {t('common.apply')}
  //                 </Button>
  //               </Col>
  //             </Row>
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
  //       dataIndex: 'actions',
  //       render: (index: number, record: any) => {
  //         return (
  //           <>
  //             <Space>
  //               <Tooltip placement="top" title={t('common.edit')}>
  //                 <TableButton
  //                   severity="info"
  //                   onClick={() => {
  //                     setEditmodaldata(record);
  //                     handleModalOpen('edit');
  //                   }}
  //                 >
  //                   <EditOutlined />
  //                 </TableButton>
  //               </Tooltip>

  //               <Tooltip placement="top" title={t('common.delete')}>
  //                 <TableButton
  //                   severity="error"
  //                   onClick={() => {
  //                     setDeletemodaldata(record);
  //                     handleModalOpen('delete');
  //                   }}
  //                 >
  //                   <DeleteOutlined />
  //                 </TableButton>
  //               </Tooltip>

  //               {record.isActive === true ? (
  //                 <Tooltip placement="top" title={t('common.deactivate')}>
  //                   <Popconfirm
  //                     placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
  //                     title={<LableText>{t('points.deactivatePartnerConfirm')}</LableText>}
  //                     okButtonProps={{
  //                       onMouseOver: () => {
  //                         setIsHover(true);
  //                       },
  //                       onMouseLeave: () => {
  //                         setIsHover(false);
  //                       },
  //                       loading: false,
  //                       style: {
  //                         color: `${defineColorBySeverity('info')}`,
  //                         background: isHover
  //                           ? 'var(--background-color)'
  //                           : `rgba(${defineColorBySeverity('info', true)}, 0.04)`,
  //                         borderColor: isHover
  //                           ? `${defineColorBySeverity('info')}`
  //                           : `rgba(${defineColorBySeverity('info', true)}, 0.9)`,
  //                       },
  //                     }}
  //                     okText={
  //                       <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
  //                         {deActivateBundle.isLoading ? (
  //                           <>
  //                             {t(`common.deactivate`)} <LoadingOutlined />
  //                           </>
  //                         ) : (
  //                           t(`common.deactivate`)
  //                         )}
  //                       </div>
  //                     }
  //                     cancelText={
  //                       <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
  //                         {t(`common.cancel`)}
  //                       </div>
  //                     }
  //                     onConfirm={() => deActivateBundle.mutateAsync(record.id)}
  //                   >
  //                     <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
  //                       <TableText>{t('common.deactivate')}</TableText>
  //                     </Button>
  //                   </Popconfirm>
  //                 </Tooltip>
  //               ) : (
  //                 <Tooltip placement="top" title={t('common.activate')}>
  //                   <Popconfirm
  //                     placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
  //                     title={<LableText>{t('points.activatePartnerConfirm')}</LableText>}
  //                     okButtonProps={{
  //                       onMouseOver: () => {
  //                         setIsHover(true);
  //                       },
  //                       onMouseLeave: () => {
  //                         setIsHover(false);
  //                       },
  //                       loading: false,
  //                       style: {
  //                         color: `${defineColorBySeverity('info')}`,
  //                         background: isHover
  //                           ? 'var(--background-color)'
  //                           : `rgba(${defineColorBySeverity('info', true)}, 0.04)`,
  //                         borderColor: isHover
  //                           ? `${defineColorBySeverity('info')}`
  //                           : `rgba(${defineColorBySeverity('info', true)}, 0.9)`,
  //                       },
  //                     }}
  //                     okText={
  //                       <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
  //                         {activateBundle.isLoading ? (
  //                           <>
  //                             {t(`common.activate`)} <LoadingOutlined />
  //                           </>
  //                         ) : (
  //                           t(`common.activate`)
  //                         )}
  //                       </div>
  //                     }
  //                     cancelText={
  //                       <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
  //                         {t(`common.cancel`)}
  //                       </div>
  //                     }
  //                     onConfirm={() => activateBundle.mutateAsync(record.id)}
  //                   >
  //                     <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
  //                       <TableText>{t('common.activate')}</TableText>
  //                     </Button>
  //                   </Popconfirm>
  //                 </Tooltip>
  //               )}
  //             </Space>
  //           </>
  //         );
  //       },
  //     },
  //   ];
  const DetailsRow = styled.div`
    display: flex;
    justify-content: flex-start;
  `;

  const DetailsTitle = styled.div`
    color: var(--text-light-color);
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.semibold};
    margin-right: 0.5rem;
    width: 25%;
  `;

  const DetailsValue = styled.div`
    color: var(--text-main-color);
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.medium};
  `;

  const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin: 1.25rem 0.5rem;
  `;

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <>
      {/* <Card title={t('config.configList')}> */}
      <Row justify={'end'}>
        {/* <Button
            type="primary"
            style={{
              marginBottom: '.5rem',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => handleModalOpen('add')}
          >
            <CreateButtonText>{t('points.addPoint')}</CreateButtonText>
          </Button> */}

        {/*    Add    */}
        {/* {modalState.add && (
            <AddPoint
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                addPoint.mutateAsync(info);
              }}
              isLoading={addPoint.isLoading}
            />
          )} */}

        {/*    EDIT    */}
        {/* {modalState.edit && (
            <EditPoint
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editEmailSetting.isLoading}
            />
          )} */}

        {/*    Delete    */}
        {/* {modalState.delete && (
            <ActionModal
              visible={modalState.delete}
              onCancel={() => handleModalClose('delete')}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('points.deletePointModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('points.deletePointModalDescription')}
              isDanger={true}
              isLoading={deletePoint.isLoading}
            />
          )} */}
      </Row>

      {/*    EDIT    */}
      {modalState.edit && (
        <EditEmailSetting
          values={editmodaldata}
          visible={modalState.edit}
          onCancel={() => handleModalClose('edit')}
          onEdit={(data: any) => editmodaldata !== undefined && handleEdit(data)}
          isLoading={editEmailSetting.isLoading}
          //   AttachmentId={editmodaldata?.attachment !== undefined ? editmodaldata?.attachment.id : 0}
        />
      )}

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={t('config.EmailSetting')}
            bordered={false}
            extra={
              <Tooltip placement="top" title={t('common.edit')}>
                <TableButton
                  severity="info"
                  onClick={() => {
                    setModalState;
                    setEditmodaldata(emailData);
                    handleModalOpen('edit');
                  }}
                >
                  <EditOutlined />
                </TableButton>
              </Tooltip>
            }
          >
            {/* <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}> */}
            <Details>
              <DetailsRow key={1}>
                <DetailsTitle>{t('config.message')}</DetailsTitle>
                <DetailsValue>{emailData?.message}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={2}>
                <DetailsTitle> {t('config.messageForResetPassword')} </DetailsTitle>
                <DetailsValue>{emailData?.messageForResetPassword}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={3}>
                <DetailsTitle> {t('config.senderEmail')} </DetailsTitle>
                <DetailsValue>{emailData?.senderEmail}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={4}>
                <DetailsTitle> {t('config.senderEnableSsl')} </DetailsTitle>
                <DetailsValue>
                  {emailData?.senderEnableSsl == true ? (
                    <TableButton severity="success">
                      <CheckOutlined />
                    </TableButton>
                  ) : (
                    <TableButton severity="error">
                      <CloseOutlined />
                    </TableButton>
                  )}
                </DetailsValue>
              </DetailsRow>
              <DetailsRow key={5}>
                <DetailsTitle> {t('config.senderHost')} </DetailsTitle>
                <DetailsValue>{emailData?.senderHost}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={6}>
                <DetailsTitle> {t('config.senderPassword')} </DetailsTitle>
                <DetailsValue>{emailData?.senderPassword}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={7}>
                <DetailsTitle> {t('config.senderPort')} </DetailsTitle>
                <DetailsValue>{emailData?.senderPort}</DetailsValue>
              </DetailsRow>
              <DetailsRow key={8}>
                <DetailsTitle> {t('config.senderUseDefaultCredential')} </DetailsTitle>
                <DetailsValue>
                  {emailData?.senderUseDefaultCredential == true ? (
                    <TableButton severity="info">
                      <CheckOutlined />
                    </TableButton>
                  ) : (
                    <TableButton severity="error">
                      <CloseOutlined />
                    </TableButton>
                  )}
                </DetailsValue>
              </DetailsRow>
            </Details>
            {/* </Form> */}
          </Card>
        </Col>
      </Row>
    </>
  );
};
