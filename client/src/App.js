import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';

import routes from './constants/routes';

import {AuthContext} from './context/AuthContext';
import {useAuth} from './hooks/auth.hook';

import NavBarContainer from './components/NavBar/NavBar';
import FooterContainer from './components/Footer/Footer';
import Loader from './components/Loader';

import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Me from './pages/Me';
import Cart from './pages/Cart';
import Purchases from './pages/Purchases'
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Error from './pages/Error';

import {Layout} from 'antd';

const {Content, Sider} = Layout;

function App() {

  const {token, loginUser, ready, user, currentUserId, logoutUser, addProductToCart, removeProductFromCart, setProductQuantityInCart, userCart} = useAuth();
  const isAuth = !!token;

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        token,
        loginUser,
        user,
        currentUserId,
        logoutUser,
        addProductToCart,
        removeProductFromCart,
        userCart,
        setProductQuantityInCart,
      }}
    >
      <Router>
        <Layout>
          <NavBarContainer/>
          <Content style={{minHeight: '100vh'}}>
            {
              ready ?
                <Routes>
                  <Route path={routes.signUpPage} exact element={<SignUp/>}/>
                  <Route path={routes.loginPage} exact element={<Login/>}/>
                  <Route path={routes.userProfilePage} exact element={<Me/>}/>
                  <Route path={routes.cartPage} exact element={<Cart/>}/>
                  <Route path={routes.purchasesPage} exact element={<Purchases/>}/>
                  <Route path={routes.mainPage} exact element={<Shop/>}/>
                  <Route path={routes.contactPage} exact element={<Contact/>}/>
                  <Route path={routes.aboutPage} exact element={<About/>}/>
                  <Route path={routes.productDetail} element={<ProductDetail/>}/>
                  <Route path={routes.errorPage} element={<Error/>}/>
                  <Route path={'/*'} element={<Navigate to={routes.errorPage}/>}/>
                </Routes> : <Loader/>
            }
          </Content>
          <FooterContainer/>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;