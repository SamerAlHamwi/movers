import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, message, Row, Tooltip } from 'antd';
import { Card } from '@app/components/common/Card/Card';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { FileSizeConfig } from '@app/interfaces/interfaces';
import { Details, DetailsRow, DetailsTitle, DetailsValue, TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { GetFileSizeSetting, UpdateFileSizeSetting } from '@app/services/configurations';
import { EditFileSizeSetting } from '@app/components/modal/EditFileSizeSetting';

export const FileSizeSetting: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [modalState, setModalState] = useState({
    edit: false,
  });
  const [fileSizeData, setFileSizeData] = useState<FileSizeConfig | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<FileSizeConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['GetFileSizeSetting'],
    () =>
      GetFileSizeSetting()
        .then((data) => {
          const result = data.data?.result;
          setFileSizeData(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: fileSizeData === undefined,
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

  const editEmailSetting = useMutation((data: FileSizeConfig) => UpdateFileSizeSetting(data));

  const handleEdit = (data: FileSizeConfig) => {
    editEmailSetting
      .mutateAsync({ ...data })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`config.editEmailSettingSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editEmailSetting.isLoading }));
  }, [editEmailSetting.isLoading]);

  return (
    <>
      <Row justify={'end'}>
        {/*    EDIT    */}
        {modalState.edit && (
          <EditFileSizeSetting
            values={editmodaldata}
            visible={modalState.edit}
            onCancel={() => handleModalClose('edit')}
            onEdit={(data: any) => editmodaldata !== undefined && handleEdit(data)}
            isLoading={editEmailSetting.isLoading}
          />
        )}
      </Row>

      <Card
        title={t('config.FileSizeSetting')}
        bordered={false}
        extra={
          <Tooltip placement="top" title={t('common.edit')}>
            <TableButton
              severity="info"
              onClick={() => {
                setModalState;
                setEditmodaldata(fileSizeData);
                handleModalOpen('edit');
              }}
            >
              <EditOutlined />
            </TableButton>
          </Tooltip>
        }
        loading={loading}
      >
        <Details>
          <DetailsRow key={1}>
            <DetailsTitle>{t('config.fileSize')}</DetailsTitle>
            <DetailsValue>{fileSizeData?.fileSize}</DetailsValue>
          </DetailsRow>
        </Details>
      </Card>
    </>
  );
};
