import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import routes from '../constants/routes';
import {AuthContext} from '../context/AuthContext';

import {Button, Form, Input, Upload} from 'antd';
import {DownloadOutlined, IdcardOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';

import {fileToBase64} from '../utils/fileToBase64';
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';

const SignUp = () => {

  const {isAuth, loginUser} = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (isAuth) {
      return nav(-1);
    }
  }, [isAuth]);

  const [avatar, setAvatar] = useState(null);
  const {request, loading} = useHttp();
  const {successMessage, errorMessage} = useMessage();

  const onFinish = async (values) => {
    await request('/user/signup', 'POST', {}, {
      name: values.name,
      login: values.login,
      password: values.password,
      avatar: avatar,
    }).then((response) => {
      loginUser(response.data.token).then(() => {
        successMessage('Signup success!');
        nav(routes.userProfilePage);
      });

    }).catch(error => {
      errorMessage(error.response.data.error);
    });

  };

  return (
    <div>
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
          textAlign: 'center',
        }}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your Name!',
            },
          ]}
        >
          <Input prefix={<IdcardOutlined/>} placeholder="Name"/>
        </Form.Item>

        <Form.Item
          name="login"
          rules={[
            {
              required: true,
              message: 'Please input your Login!',
            },
          ]}
        >
          <Input prefix={<UserOutlined/>} placeholder="Login"/>
        </Form.Item>

        <Form.Item
          name='image'
          valuePropName='image'
          help='Image, only .png .jpeg format!'
          rules={[
            {
              required: true,
              message: 'Please select your image!',
            },
          ]}
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList[0];
          }}
        >
          <Upload.Dragger
            listType="picture-card"
            accept=".png,.jpg"
            maxCount={1}
            showUploadList={false}

            beforeUpload={(file) => {

              if (file.type === 'image/png' || file.type === 'image/jpeg') {
                if (file.size / 1024 < 20) {
                  return true;
                }
                errorMessage('File size must be > 20kb');
                return Upload.LIST_IGNORE;
              }
              errorMessage('File format must be .png or .jpeg')
              return Upload.LIST_IGNORE;
            }}

            onChange={async (event) => {

              const file = event.file.originFileObj;
              if (file) {
                try {
                  const base64 = await fileToBase64(file);
                  setAvatar(base64);
                } catch (e) {
                  console.warn(e);
                }
              } else setAvatar(null);

            }}
          >
            {
              avatar ?
                <div>
                  <div style={{color: '#8f8f8f'}}>Click here or drag image...</div>
                  <img
                    src={avatar}
                    alt="avatar"
                    style={{
                      width: '50%',
                    }}
                  />
                </div>
                :
                <div>
                  <DownloadOutlined/>
                  <div style={{color: '#8f8f8f'}}>Click here or drag image...</div>
                </div>
            }
          </Upload.Dragger>
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

        <Button loading={loading} style={{width: '100%'}} type="primary" htmlType="submit">
          Signup
        </Button>
        <Form.Item style={{float: 'left'}}>
          Or <Link to="/login">login now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;