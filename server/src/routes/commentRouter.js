const express = require('express');
const commentHandler = require('../handlers/commentHandler');
const commentRouter = new express.Router();
const {protect} = require('../middleware/authMiddleware')

commentRouter
  .get('/:productId/comments', commentHandler.getComments)
  .post('/:productId/comments', protect, commentHandler.createComment)
  .delete('/:productId/comments', protect, commentHandler.deleteComment)
  .patch('/:productId/comments', protect, commentHandler.updateComment)

module.exports = commentRouter;
