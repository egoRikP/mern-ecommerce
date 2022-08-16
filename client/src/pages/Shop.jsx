import React, {useContext, useEffect, useState} from 'react';

import {Button, Card, Checkbox, Input, Layout, List, Pagination, Popover, Select} from 'antd';
import {AuthContext} from '../context/AuthContext';
import {useMessage} from '../hooks/message.hook';
import {CloseOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import {useHttp} from '../hooks/http.hook';

const {Sider} = Layout;
const {Option} = Select;
const {Search} = Input;

const Shop = () => {

  const {isAuth, user, token, addProductToCart, removeProductFromCart, userCart} = useContext(AuthContext);
  const {successMessage, errorMessage} = useMessage();

  const [products, setProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([])
  const [pages, setPages] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [checkedCategories, setCheckedCategory] = useState([]);
  const [checkedSuppliers, setCheckedSuppliers] = useState([])
  const [selectedSortBy, setSelectedSortBy] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const {request, loading} = useHttp();

  const getInfoForProducts = async () => {
    await request('/search/info', 'GET').then((response) => {
      setCategories(response.data.categories);
      setSuppliers(response.data.suppliers)
    }).catch(console.error);
  }

  useEffect(() => {
    getInfoForProducts();
  }, []);

  const onSearchTerm = async (e) => {

    const categoriesArr = JSON.stringify(checkedCategories);
    const suppliersArr = JSON.stringify(checkedSuppliers);

    const url = `/search/params?searchText=${e}&categories=${categoriesArr}&suppliers=${suppliersArr}&sortPrice=${selectedPrice}`;

    await request(url, 'GET').then((response) => {
      if (!response.data.error) {
        setProducts(response.data.items);
        setTotalItems(response.data.totalCountItems);
        setItemsPerPage(response.data.itemsPerPage);
      } else {
        setProducts([]);
      }
    }).catch(console.error);
  }

  const getProductsByParams = async () => {
    const categoriesArr = JSON.stringify(checkedCategories);
    const suppliersArr = JSON.stringify(checkedSuppliers);

    const url = `/search/params?categories=${categoriesArr}&suppliers=${suppliersArr}&sortPrice=${selectedPrice}&page=${currentPage}&sortBy=${selectedSortBy}`;

    await request(url, 'GET').then(res => {
      if (!res.data.error) {
        setProducts(res.data.items);
        setTotalItems(res.data.totalCountItems);
        setItemsPerPage(res.data.itemsPerPage);
      } else {
        setProducts([]);
      }
    }).catch(console.error)
  }

  useEffect(() => {
    getProductsByParams();
  }, [checkedCategories, checkedSuppliers, selectedPrice, selectedSortBy, currentPage])

  const addToCart = async (id, product) => {

    await request('/user/me/cart/', 'POST', {Authorization: 'Bearer ' + token}, {productId: id}).then(() => {
      addProductToCart(id, product);
      successMessage(`Product ${product} success added to cart!`, <PlusOutlined/>)
    }).catch((e) => {
      errorMessage(`Product ${product} failed added to cart!`)
    });
  };

  const deleteProductFromCart = async (id, product) => {

    await request('/user/me/cart', 'DELETE', {Authorization: 'Bearer ' + token}, {productId: id}).then(() => {
      removeProductFromCart(id, product)
      successMessage(`Product ${product} success deleted from cart!`, <MinusOutlined/>)
    }).catch(() => errorMessage('Error!'))

  };

  return (
    <Layout>

      <Sider style={{backgroundColor: 'lightgray'}}>
        <div>Price:</div>
        <Select className='price' defaultValue="Normal" style={{width: 120}} onChange={(e) => {
          setSelectedPrice(e)
        }}>
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
          <Option value="norm">Normal</Option>
        </Select>
        <div>Category:</div>
        <div id='categories'>
          {Object.values(categories).map(({name, id}) =>
            <Checkbox checked={checkedCategories.includes(name)} key={id} value={name} onChange={(e) => {

              checkedCategories.includes(name) ? setCheckedCategory((prevState => (checkedCategories.filter((e) => {
                return e !== name;
              })))) : setCheckedCategory((prevState => [...prevState, name]))

            }}>{name}</Checkbox>,
          )}
        </div>

        <div>Suppliers:</div>
        <div id='suppliers'>
          {Object.values(suppliers).map(({name, id}) =>
            <Checkbox checked={checkedSuppliers.includes(name)} key={id} value={name} onChange={(e) => {

              checkedSuppliers.includes(name) ? setCheckedSuppliers((prevState => (checkedSuppliers.filter((e) => {
                return e !== name;
              })))) : setCheckedSuppliers((prevState => [...prevState, name]))

            }}>{name}</Checkbox>,
          )}
        </div>

      </Sider>

      <div style={{
        height: '100%',
        width: '100%',
        textAlign: 'center',
      }}>

        <div style={{paddingTop: 30, paddingBottom: 30}}>
          <Search
            id='search'
            loading={loading}
            enterButton
            onSearch={onSearchTerm}
            placeholder={'Search text...'}
            style={{
              width: 304,
            }}
          />

          <label htmlFor='sortBy'>Sort by:</label>

          <Select className='sortBy' id='sortBy' defaultValue="popular" style={{width: 120}} onChange={(e) => {
            setSelectedSortBy(e)
          }}>
            <Option value="-1">New</Option>
            <Option value="1">Popular</Option>
          </Select>

        </div>

        {
          products.length ?
            <div>
              <List
                grid={{
                  gutter: 30,
                }}
                dataSource={products}
                renderItem={({name, photo, price, id}) => (
                  <List.Item style={{border: '1px solid gray'}}>
                    <Card
                      style={{
                        width: 300,
                        height: 300,
                      }}
                      cover={
                        <a href={`/product/${id}`}>
                          <img
                            alt="example"
                            src={photo}
                            style={{width: 300, height: 300}}
                          />
                        </a>
                      }
                    >
                    </Card>
                    <List.Item.Meta
                      title={name}
                      description={
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                          <h2>{price}</h2>
                          {
                            isAuth && user ?
                              <div>
                                {
                                  userCart.some(val => val.id === id) ?
                                    <Button type='default' icon={<CloseOutlined/>} onClick={() => {
                                      deleteProductFromCart(id, name)
                                    }}/> :
                                    <Button type='default' icon={<ShoppingCartOutlined/>} onClick={() => {
                                      addToCart(id, name)
                                    }}/>

                                }
                              </div>
                              :
                              <div>
                                <Popover content={'To add to cart, you need login!'}>
                                  <div>
                                    <Button type='default' disabled={true} icon={<ShoppingCartOutlined/>}/>
                                  </div>
                                </Popover>
                              </div>
                          }
                        </div>
                      }
                    >
                    </List.Item.Meta>
                  </List.Item>
                )}
              />

              <Pagination current={currentPage} onChange={(e) => {
                setCurrentPage(e)
              }} pageSize={itemsPerPage} total={totalItems}/>

            </div>

            : <h2 style={{textAlign: 'center'}}>Found 0 products with this filters!</h2>
        }
      </div>
    </Layout>
  );
}

export default Shop;