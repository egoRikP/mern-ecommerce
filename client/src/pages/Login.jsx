import React, {useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import routes from '../constants/routes';
import {useMessage} from '../hooks/message.hook';

import {Button, Checkbox, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {useHttp} from '../hooks/http.hook';

const Login = () => {

  const {isAuth, loginUser} = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (isAuth) {
      return nav(-1);
    }
  }, [isAuth]);

  const {request, loading} = useHttp();
  const {successMessage, errorMessage} = useMessage();

  const onFinish = async (values) => {
    await request('/user/login', 'POST', {}, {
      login: values.login,
      password: values.password,
    }).then((response) => {
      loginUser(response.data.token).then(() => {
        successMessage('Login success!');
        nav(routes.userProfilePage);
      });
    }).catch(error => {
      errorMessage(error.response.data.error);
    });

  };

  return (
    <div style={{textAlign: 'center'}}>
      <Form
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        disabled={loading}
        style={{
          maxWidth: '300px',
          height: '100%',
          margin: 'auto',
        }}
      >
        <Form.Item
          name="login"
          rules={[
            {
              required: true,
              message: 'Please input your Login!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined/>}
            placeholder="Login"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined/>}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" style={{float: 'left'}}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Link to="" style={{float: 'right'}}>
            Forgot password
          </Link>
        </Form.Item>

        <Form.Item>
          <Button loading={loading} style={{width: '100%'}} type="primary" htmlType="submit">
            Login
          </Button>
          <Form.Item style={{float: 'left'}}>
            Or <Link to="/signup">signup now!</Link>
          </Form.Item>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;