import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Button, Layout, Table, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import routes from '../constants/routes';
import Loader from '../components/Loader';

const Purchases = () => {

  const {isAuth, user} = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      return nav(routes.loginPage);
    }
  }, [isAuth]);

  const [purchasesList, setPurchasesList] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const tableColumns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      render: (photo) => {
        return <Avatar src={photo}/>
      },
    },
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
  ];

  return (
    <Layout>
      <div>
        {/*{*/}
        {/*  user ?*/}
        {/*    <div style={{textAlign: 'center'}}>*/}
        {/*      <div>*/}
        {/*        <Typography.Title level={2} style={{textAlign: 'center'}}>Purchases:</Typography.Title>*/}
        {/*        <div>{*/}
        {/*          user.purchases.length ?*/}
        {/*            <div>*/}
        {/*              <Table pagination={false} dataSource={purchases} columns={tableColumns}/>*/}
        {/*              <Button type='primary'>Clear purchase history</Button>*/}
        {/*            </div> :*/}
        {/*            <div>You have not made any purchases yet!</div>*/}
        {/*        }</div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*    : <Loader/>*/}
        {/*}*/}
        <h2 style={{textAlign:'center'}}>
          Purchases in development!
        </h2>
      </div>
    </Layout>
  );
}

export default Purchases;