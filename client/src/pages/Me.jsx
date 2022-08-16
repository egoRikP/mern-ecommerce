import React, {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import routes from '../constants/routes';
import {AuthContext} from '../context/AuthContext';

import {Avatar, Layout} from 'antd';
import Loader from '../components/Loader';

const Me = () => {

  const {isAuth, user} = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      nav(routes.loginPage);
    }
  }, [isAuth]);

  return (
    <Layout>
      <div>
        {
          user ?
            <div>
              <h2 style={{textAlign: 'center'}}>My Personal Information:</h2>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <Avatar
                  shape={'square'}
                  size={{
                    xs: 100,
                    sm: 125,
                    md: 150,
                    lg: 175,
                    xl: 200,
                    xxl: 225,
                  }}
                  icon={<img src={user.avatar}/>}
                />
                <div style={{alignSelf: 'center'}}>
                  <h1 style={{fontSize: 30}}>Name {user.name}</h1>
                  <h1 style={{fontSize: 30}}>Login {user.login}</h1>
                </div>
              </div>
            </div>
            : <Loader/>
        }
      </div>
    </Layout>
  );
}

export default Me;