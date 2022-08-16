const express = require('express');
const cartHandler = require('../handlers/cartHandler');
const cartRouter = new express.Router();

cartRouter
  .get('/cart', cartHandler.getMyCart)
  .post('/cart', cartHandler.addToMyCart)
  .patch('/cart/',cartHandler.updateProductQuantity)
  .patch('/cart/q',cartHandler.setProductQuantity)
  .delete('/cart', cartHandler.deleteFromMyCart);

module.exports = cartRouter;
