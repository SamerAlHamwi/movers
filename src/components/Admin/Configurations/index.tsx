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
import { GetEmailSetting } from '@app/services/configurations';
import { EmailSetting } from './EmailSetting';

export const Configurations: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [emailData, setEmailData] = useState<Config | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* <Card title={t('config.configList')}> */}
      <EmailSetting />
    </>
  );
};
