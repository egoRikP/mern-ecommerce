const express = require('express');
const router = new express.Router();
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');

router
  .use('/user', userRouter)
  .use('/search', productRouter)

  .use((req, res, next) => {
    res.json({error: 'This page not found!'});
  })
  .use((err, req, res, next) => {
    res.json({error: err});
  })

module.exports = router;
