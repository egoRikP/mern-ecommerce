const express = require('express');
const productHandler = require('../handlers/productHandler');
const productRouter = new express.Router();
const commentRouter = require('../routes/commentRouter');

productRouter
  .get('/info', productHandler.getAllInformation)
  .get('/product/:productId/', productHandler.getProductById)
  .get('/params?', productHandler.getProductsByParams)
  .use('/', commentRouter)

module.exports = productRouter;
