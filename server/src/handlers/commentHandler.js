const db = require('../db');
const uuid = require('uuid');
const moment = require('moment');

async function createComment(req, res, next) {

  const productId = req.params.productId;
  const product = await db.collection('products').findOne({id: productId});

  if (!product) {
    return next({message: `Not found product with id ${productId}!`, added: false});
  }

  const neededParams = [
    req.user.name, req.user.id, req.body.comment, req.user.avatar,
  ];

  let invalidParams = false;

  neededParams.forEach(e => {
    !e ? invalidParams = true : invalidParams;
  })

  if (invalidParams === true) {
    return next('Invalid Params!');
  }

  let userComment = await db.collection('productComments').insertOne({
    time: moment().format('YYYY-MM-DD HH:mm'),
    productId: productId,
    commentId: uuid.v4(),
    userId: req.user.id,
    name: req.user.name,
    comment: req.body.comment,
    photo: req.user.avatar,
  });

  userComment = await db.collection('productComments').findOne({_id: userComment.insertedId})

  res.json({commentData: userComment})
}

async function getComments(req, res, next) {

  const productId = req.params.productId;

  const product = await db.collection('products').findOne({id: productId});
  if (!product) {
    return next(`Product with id ${productId} not found!`);
  }

  const productComments = await db.collection('productComments').find({'productId': productId}).toArray();

  if (!productComments.length) {
    res.status(204);
    next(`Found 0 comments for ${product.name} product with id ${productId}!`)
    return;
  }

  res.json(productComments)

}

async function deleteComment(req, res, next) {

  const productId = req.params.productId;
  const name = req.user.name;
  const commentId = req.body.commentId;

  const neededParams = [
    req.user.name, commentId, productId,
  ];

  let invalidParams = false;

  neededParams.forEach(e => {
    e === '' || e === undefined ? invalidParams = true : invalidParams;
  })

  if (invalidParams === true) {
    return next({message: 'Invalid Params!', deleted: false});
  }

  const result = await db.collection('productComments').deleteOne({$and: [{'name': name}, {'productId': productId}, {'commentId': commentId}]});

  result.deletedCount === 1 ?
    res.json({commentId: commentId, delete: true}) :
    next({deleted: false})

}

async function updateComment(req, res, next) {

  const productId = req.params.productId;
  const commentId = req.body.commentId;
  const name = req.user.name;

  const neededParams = [
    productId, commentId, name,
  ];

  let invalidParams = false;

  neededParams.forEach(e => {
    e === '' || e === undefined ? invalidParams = true : invalidParams;
  })

  if (invalidParams === true) {
    return next('Invalid Params!');
  }

  if (!await db.collection('productComments').findOne({$and: [{'name': name}, {'productId': productId}, {'commentId': commentId}]})) {
    return next({message: `Comment with id ${commentId} not found!`, updated: false});
  }

  await db.collection('productComments').findOneAndUpdate({$and: [{'productId': productId}, {'commentId': commentId}]}, {
    $set: {comment: req.body.comment, time: moment().format('YYYY-MM-DD HH:mm')},
  });

  res.json({
    message: `${name} your comment with id ${commentId} updated!`,
    updated: true,
    time: moment().format('YYYY-MM-DD HH:mm'),
  });

}

module.exports = {
  getComments,
  createComment,
  deleteComment,
  updateComment,
};
