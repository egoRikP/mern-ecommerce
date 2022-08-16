import React, {useEffect, useState} from 'react';
import axios from 'axios';

export const useAuth = () => {

  const [isAuth, setAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userCart, setUserCart] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [ready, setReady] = useState(false);

  const loginUser = async (token) => {
    await axios.get('/user/me', {headers: {Authorization: 'Bearer ' + token}}).then((response) => {
      setUser(response.data);
      setCurrentUserId(response.data.id);
      setUserCart(response.data.list);
      setAuth(true);
      document.cookie = `isAuth=1; expires=Fri, 24 Jun 2023 00:00:00 GMT; path=/; domain=localhost;`;
      document.cookie = `token=${token}; expires=Fri, 24 Jun 2023 00:00:00 GMT; path=/; domain=localhost;`;
      document.cookie = `userId=${response.data.id}; expires=Fri, 24 Jun 2023 00:00:00 GMT; path=/; domain=localhost;`;
    }).catch(logoutUser);
  };

  const addProductToCart = (id) => {
    setUserCart(prevState => ([...prevState, {id: id, qty: 1}]));
  };

  const setProductQuantityInCart = (id, qty) => {

    setUserCart(
      userCart.map(obj => {
        if (obj.id === id) {
          return {...obj, qty: qty};
        }
        return obj;
      }),
    );

  }

  const removeProductFromCart = (id) => {
    setUserCart(userCart.filter(e => e.id !== id));
  };

  const buyProducts = (id, qty) => {
    setUserPurchases(prevState => ([...prevState, {id: id, qty: qty}]));
  };

  const logoutUser = () => {
    setAuth(false);
    setToken(null);
    setUser(null);
    setCurrentUserId(null);
    document.cookie.split('; ').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=; path=/; domain=localhost; expires=${new Date().toUTCString()}; `);
    });
  };

  useEffect(() => {

    document.cookie.split('; ').forEach((e) => {

      if (e.split('=')[0] === 'token') {
        setAuth(true);
        setToken(e.split('=')[1]);
      }
      if (e.split('=')[0] === 'userId') {
        setCurrentUserId(e.split('=')[1]);
      }

    });

    if (isAuth && token) {
      loginUser(token);
    }
    setReady(true)
  }, [isAuth]);

  return {
    isAuth,
    token,
    loginUser,
    ready,
    user,
    currentUserId,
    logoutUser,
    addProductToCart,
    removeProductFromCart,
    setProductQuantityInCart,
    userCart,
  };
};
