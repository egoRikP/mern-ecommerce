import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import routes from '../constants/routes';
import {AuthContext} from '../context/AuthContext';

import {Avatar, Button, InputNumber, Table, Typography} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';

import Loader from '../components/Loader';
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';

const Cart = () => {

  const {isAuth, user, token, setProductQuantityInCart, removeProductFromCart, userCart} = useContext(AuthContext);

  const nav = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      nav(routes.loginPage);
    }
  }, [isAuth]);

  const [cartList, setCartList] = useState([]);
  const [cart, setCart] = useState([]);

  const {request, loading} = useHttp();
  const {successMessage, errorMessage} = useMessage();

  useEffect(() => {
    if (userCart) {
      setCartList(userCart);
    }
  }, [user])

  useEffect(() => {
    if (cartList) {
      cartList.forEach(async ({id, qty}, index) => {

        await request(`/search/product/${id}`, 'GET').then((response) => {
          if (!response.data.error) {
            setCart(prevState => [...prevState,
              {
                key: index,
                id: id,
                name: response.data.name,
                photo: response.data.photo,
                price: response.data.price,
                qty: qty,
              },
            ]);
          }
        }).catch(console.error);
      });
    }
  }, [cartList]);

  const addOneToCart = async (id) => {

    await request('/user/me/cart', 'PATCH', {Authorization: 'Bearer ' + token}, {
      quantity: +1,
      productId: id,
    }).then(() => {

      setCart((prevState => prevState.map(obj => {
        if (obj.id === id) {
          return {...obj, qty: obj.qty + 1};
        }
        return obj;
      })));

    }).catch(console.error)

  };

  const removeOneFromCart = async (id) => {

    await request('/user/me/cart', 'PATCH', {Authorization: 'Bearer ' + token}, {
      quantity: -1,
      productId: id,
    }).then(() => {

      setCart((prevState => prevState.map(obj => {
          if (obj.id === id) {
            return {...obj, qty: obj.qty - 1};
          }
          return obj;
        },
        )),
      );

    }).catch(console.error)

  };

  const setProductQuantity = async (id, q) => {

    await request('/user/me/cart/q', 'PATCH', {Authorization: 'Bearer ' + token}, {
      productId: id,
      quantity: q,
    }).then(() => {

      setCart((prevState) => prevState.map(obj => {
          if (obj.id === id) {
            return {...obj, qty: q};
          }
          return {...obj};
        }),
      );

      setProductQuantityInCart(id, q);

    }).catch(console.error);
  };

  const deleteProductFromCart = async (id) => {

    await request('/user/me/cart/', 'DELETE', {Authorization: 'Bearer ' + token}, {productId: id}).then(() => {
      setCart(prevState => prevState.filter(e => e.id !== id));
      removeProductFromCart(id);
      successMessage('Product success deleted!')
    }).catch(() => errorMessage('Error!'))

  };

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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Qty',
      render: (value) => {
        return (
          <div>
            <Button disabled={value.qty === 1} loading={loading} icon={<MinusOutlined/>} onClick={() => {
              removeOneFromCart(value.id)
            }}/>
            <InputNumber min={1} max={99} disabled={loading} controls={false} value={value.qty}
                         id={value.id} onChange={(e) => {
              optimisedVersion(value.id, e)
            }}/>
            <Button disabled={value.qty === 99} loading={loading} icon={<PlusOutlined/>} onClick={() => {
              addOneToCart(value.id)
            }}/>
          </div>
        )
      },
    },
    {
      title: 'Total',
      render: (value) => {
        return <div>{value.price * value.qty}</div>
      },
    },
    {
      render: (value) => {
        return (
          <Button onClick={() => {
            deleteProductFromCart(value.id)
          }}>Delete</Button>
        )
      },
    },
  ];

  const debounceInputNumber = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args)
      }, 1000)
    }
  }

  const optimisedVersion = useCallback(debounceInputNumber(setProductQuantity), [])

  return (
    <div>
      {
        user ?
          <div style={{textAlign: 'center'}}>
            <div>
              <Typography.Title level={2} style={{textAlign: 'center'}}>Cart:</Typography.Title>
              <div style={{width: 'auto', display: 'flex', justifyContent: 'center'}}>
                {
                  cart.length ?
                    <Table pagination={false} dataSource={cart} columns={tableColumns}/>
                    :
                    <h2>The cart is empty, but it's never too late to fix it :)</h2>
                }
              </div>
            </div>
          </div>
          : <Loader/>
      }
    </div>
  );
}

export default Cart;