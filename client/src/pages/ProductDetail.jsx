import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';

import Loader from '../components/Loader';

import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

import {Avatar, Button, Card, Comment, Form, Image, Input, Layout, Popover} from 'antd';
import routes from '../constants/routes';

const {TextArea} = Input;

const ProductDetail = () => {

  const {isAuth, user, token, currentUserId, addProductToCart, removeProductFromCart, userCart} = useContext(AuthContext);
  const {request, loading} = useHttp();
  const {successMessage, errorMessage} = useMessage();

  const {productId} = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComment] = useState([]);

  const [userComment, setUserComment] = useState('');
  const [selectedComment, setSelectedComment] = useState('');
  const [showUpdateComment, setShowUpdateComment] = useState(false);
  const [updateComment, setUpdateComment] = useState('');

  const nav = useNavigate();

  const getProductDetail = async () => {
    await request('/search/product/' + productId, 'GET').then(res => {
      if (!res.data.error) {
        setProduct(res.data)
      } else nav(routes.errorPage)
    }).catch(console.error);
  };

  const getProductComments = async () => {
    await request(`/search/${productId}/comments`, 'GET').then((res) => {
      if (!res.data.error) {
        setComment(res.data)
      }
    });
  };

  useEffect(() => {
    getProductDetail();
    getProductComments();
  }, []);

  const addToCart = async () => {

    await request('/user/me/cart/', 'POST', {Authorization: 'Bearer ' + token}, {productId: productId}).then(() => {
      addProductToCart(productId)
      successMessage(`Product ${product.name} success added to cart!`, <PlusOutlined style={{color: 'green'}}/>)
    }).catch((e) => {
      errorMessage(`Product ${product.name} failed added to cart!`, <PlusOutlined style={{color: 'red'}}/>)
    });

  };

  const deleteProductFromCart = async () => {
    document.getElementById('cartDeleteButton').setAttribute('loading', 'true');
    await request('/user/me/cart/', 'DELETE', {Authorization: 'Bearer ' + token}, {productId: productId}).then(() => {
      removeProductFromCart(productId);
      document.getElementById('cartDeleteButton').setAttribute('loading', 'false');
      successMessage(`Product ${product.name} success deleted from cart!`, <MinusOutlined style={{color: 'green'}}/>)
    }).catch(() => {
      document.getElementById('cartDeleteButton').setAttribute('loading', 'false');
      errorMessage(`Product ${product.name} failure deleted from cart!`, <MinusOutlined
        style={{color: 'red'}}/>)
    })

  };

  const onChangeComment = (e) => {
    setUserComment(e.currentTarget.value);
  };

  const handleSubmitComment = async () => {
    if (!userComment) return;

    await request(`/search/${productId}/comments`, 'POST', {Authorization: 'Bearer ' + token}, {comment: userComment}).then((response) => {
      setUserComment('')
      setComment(prevState => [...prevState, response.data.commentData]);
      successMessage('Your comment was added!');
    }).catch((error) => {
      errorMessage(error.response.data.error);
    })

  };

  const showUpdateUserComment = (event) => {
    setShowUpdateComment(!showUpdateComment);
    const id = event.currentTarget.id;
    setSelectedComment(id);
    const thisCom = comments.filter((e) => {
      return e.commentId === id;
    });
    setUpdateComment(thisCom[0].comment);
  };

  const onChangeUpdateComment = (e) => {
    setUpdateComment(e.target.value);
  };

  const submitUpdateComment = async () => {

    await request(`/search/${productId}/comments`, 'PATCH', {Authorization: 'Bearer ' + token}, {
      commentId: selectedComment,
      comment: updateComment,
    }).then((response) => {
      const newState = comments.map(obj => {
        if (obj.commentId === selectedComment) {
          return {...obj, comment: updateComment, time: response.data.time};
        }
        return obj;
      });
      setComment(newState);
      successMessage('Comment was updated!');
      setSelectedComment('');
    }).catch((err) => {
      errorMessage(err.response.data.err || 'Unexpected error!');
    })
  };

  const deleteComment = async (value) => {
    const id = value.currentTarget.id;

    await request(`/search/${productId}/comments/`, 'DELETE', {Authorization: 'Bearer ' + token}, {commentId: id}).then((res) => {
      successMessage('Your comment was deleted!')
      setComment(comments.filter(e => e.commentId !== res.data.commentId));
    }).catch((err) => {
      errorMessage(err.response.data.error);
    });
  };

  return (
    <Layout>
      <div>
        {
          product ?
            <div>

              <div>
                <Card title={<h1 style={{textAlign: 'center'}}>{product.name}</h1>}>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'center', margin: '0 auto'}}>
                      <div>
                        <div>
                          <Image
                            width={200}
                            src={product.photo}
                          />
                        </div>
                      </div>
                      <div>
                        <div>
                          <h1>Description: {product.description}</h1>
                        </div>
                        <div>
                          <h1>Price : {product.price}</h1>
                        </div>
                        {
                          isAuth && user ?
                            <div>
                              {
                                Object.values(userCart).some(val => val.id === productId) ?
                                  <Button id='cartDeleteButton' type='default' icon={<CloseOutlined/>}
                                          onClick={deleteProductFromCart}/> :
                                  <Button id='cartAddButton' type='default' icon={<ShoppingCartOutlined/>}
                                          onClick={addToCart}/>
                              }
                            </div>
                            :
                            <Popover content={'To add to cart, you need login!'}>
                              <Button type='default' disabled={true} icon={<ShoppingCartOutlined/>}/>
                            </Popover>
                        }
                      </div>
                    </div>
                  </div>
                </Card>
              </div>


              <div style={{margin: '10px 30% 10px 30%'}}>
                {
                  isAuth && user ?
                    <div>
                      <Comment
                        avatar={<Avatar src={user.avatar} alt=""/>}
                        content={
                          <div>
                            <Form.Item>
                              <TextArea showCount maxLength={300} style={{maxHeight: '350px'}} value={userComment}
                                        autoSize={{maxRows: 10, minRows: 4}} rows={4} onChange={onChangeComment}/>
                            </Form.Item>
                            <Form.Item>
                              <Button htmlType="submit" loading={loading} onClick={handleSubmitComment} type="primary">
                                Add Comment
                              </Button>
                            </Form.Item>
                          </div>
                        }
                      />
                    </div> : <h2 style={{textAlign: 'center'}}>To add comment, you need login!</h2>
                }
              </div>

              <div>
                {
                  comments.length ?
                    <div>
                      <h2 style={{textAlign: 'center'}}>Comments:</h2>
                      {
                        comments.map(({commentId, userId, name, photo, comment, time}) =>
                          <div style={{margin: '10px 30% 10px 30%'}} key={commentId}>
                            <Comment
                              author={name}
                              avatar={photo}
                              datetime={time}
                              content={
                                isAuth && user && showUpdateComment === true && selectedComment === commentId ?
                                  <div style={{display: 'flex'}}>
                                    <Input value={updateComment} onChange={onChangeUpdateComment}/>
                                    {
                                      comment !== updateComment ?
                                        <Button id={commentId} type='primary'
                                                onClick={submitUpdateComment}>Update</Button> :
                                        <Button type='primary' disabled={true}>Update</Button>
                                    }
                                  </div>
                                  : comment
                              }
                              actions={
                                isAuth && user && currentUserId === userId ? [
                                  <DeleteOutlined id={commentId} key='delete' onClick={deleteComment}/>,
                                  <EditOutlined id={commentId} key="edit" onClick={showUpdateUserComment}/>,
                                ] : null
                              }
                            />
                          </div>,
                        )
                      }
                    </div> : <h2 style={{color: 'gray', textAlign: 'center'}}>There are no comments...</h2>
                }
              </div>

            </div> : <Loader/>
        }
      </div>
    </Layout>
  )
}

export default ProductDetail;