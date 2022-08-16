const express = require('express');
const userRouter = new express.Router();
const userHandler = require('../handlers/userHandler');
const cartRouter = require('../routes/cartRouter');
const {protect} = require('../middleware/authMiddleware');

userRouter
  .use('/me', protect, cartRouter)
  .get('/me', protect, userHandler.getUser)
  .post('/login', userHandler.loginUser)
  .post('/signup', userHandler.registerUser)

module.exports = userRouter;
