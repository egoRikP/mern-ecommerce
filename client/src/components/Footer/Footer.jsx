import React from 'react';
import {Layout} from 'antd';

const {Footer} = Layout;

const FooterContainer = () => {
  return (
    <Layout>
      <Footer>
        <div style={{textAlign: 'center'}}>
          ©2022 Created with Ant Design
        </div>
      </Footer>
    </Layout>
  );
}

export default FooterContainer;
