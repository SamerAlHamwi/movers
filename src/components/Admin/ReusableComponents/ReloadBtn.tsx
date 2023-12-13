import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { SetStateAction } from 'jotai';
import React, { Dispatch, FC } from 'react';

interface ReloadBtnProps {
  setRefetchData: Dispatch<SetStateAction<any>>;
}
const ReloadBtn: FC<ReloadBtnProps> = ({ setRefetchData }) => {
  return (
    <Button
      type="primary"
      style={{
        width: '50px',
        margin: '0 .5rem .5rem .5rem',
      }}
      onClick={() => setRefetchData((prev: any) => setRefetchData(!prev))}
      icon={<ReloadOutlined />}
    />
  );
};

export default ReloadBtn;
