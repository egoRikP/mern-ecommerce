import React, {useContext} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import routes from '../../constants/routes';
import {AuthContext} from '../../context/AuthContext';

import {Avatar, Button, Layout, Menu} from 'antd';
const {Header} = Layout;

const logo = require('../../assets/Logo-Test.png')

const NavBarContainer = () => {

  const {logoutUser, isAuth, user} = useContext(AuthContext);
  const nav = useNavigate();
  const location = useLocation();

  const logout = () => {
    logoutUser();
    if (!location.pathname.startsWith('/product/')) {
      nav(routes.loginPage);
    }
  };

  return (
    <Header>
      <div style={{display: 'flex'}}>

        <img
          className='logo'
          style={{
            maxHeight: 64,
          }}
          src={logo}
          alt=''
        />

        <Menu
          style={{flex: 'auto'}}
          mode='horizontal'
          theme='dark'
          selectable={false}
          items={[
            {
              label: <Link to='/'>Search</Link>,
            },
            {
              label: <Link to='/about'>About</Link>,
            },
            {
              label: <Link to='/contact'>Contact</Link>,
            },
          ]}
        />

        <Menu
          style={{flex: 'auto', justifyContent: 'flex-end'}}
          theme='dark'
          mode='horizontal'
          selectable={false}
          items={isAuth && user ? [{
              key: 0,
              label: <Avatar type='icon' src={user.avatar || null}/>,
              children: [
                {
                  label: <Link to={routes.userProfilePage}>Profile</Link>,
                },
                {
                  label: <Link to='/me/cart'>Cart</Link>,
                },
                {
                  label: <Link to='/me/purchases'>Purchases</Link>,
                },
                {type: 'divider'},
                {
                  label: <Button type='primary' onClick={logout}>Log Out</Button>,
                },
              ],
            }] :
            [
              {
                label: <Link to={routes.loginPage}>Login</Link>,
              },
              {
                label: <Link to={routes.signUpPage}>SignUp</Link>,
              },
            ]
          }
        />

      </div>
    </Header>
  )
};

export default NavBarContainer;
