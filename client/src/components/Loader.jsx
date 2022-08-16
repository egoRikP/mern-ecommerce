import React from 'react';

import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

const Loader = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin indicator={
        <LoadingOutlined style={{fontSize: 60}} spin/>
      }/>
    </div>
  )
}

export default Loader;