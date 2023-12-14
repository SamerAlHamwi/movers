import { ReloadOutlined } from '@ant-design/icons';
import { TableButton } from '@app/components/GeneralStyles';
import { Button, Tooltip } from 'antd';
import { SetStateAction } from 'jotai';
import React, { Dispatch, FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ReloadBtnProps {
  setRefetchData: Dispatch<SetStateAction<any>>;
}

const ReloadBtn: FC<ReloadBtnProps> = ({ setRefetchData }) => {
  const { t } = useTranslation();

  return (
    <Tooltip placement="top" title={t('common.refetch')}>
      <TableButton
        style={{
          width: '50px',
          height: '50px',
          margin: '0 .5rem .5rem .5rem',
        }}
        severity="info"
        onClick={() => setRefetchData((prev: any) => setRefetchData(!prev))}
      >
        <ReloadOutlined />
      </TableButton>
    </Tooltip>

    // <Button
    //   type="primary"
    //   style={{
    //     width: '50px',
    //     margin: '0 .5rem .5rem .5rem',
    //   }}
    //   onClick={() => setRefetchData((prev: any) => setRefetchData(!prev))}
    //   icon={<ReloadOutlined />}
    // />
  );
};

export default ReloadBtn;
