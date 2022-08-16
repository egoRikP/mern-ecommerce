const db = require('../db');

async function getMyCart(req, res) {

  const user = await db.collection('users').findOne({id: req.user.id});
  return res.json(user.list);

}

async function addToMyCart(req, res, next) {

  const productId = req.body.productId;

  if (!productId) {
    next('Please valid Product ID');
    return;
  }

  const productExist = await db.collection('products').findOne({id: productId});
  if (!productExist) {
    next('Product with this id not found and cannot be added into your cart!');
    return;
  }

  await db.collection('users').findOneAndUpdate({id: req.user.id}, {$addToSet: {list: {id: productId, qty: 1}}});

  res.json(`${req.user.name} your cart was update.Added ${productId}`)

}

async function updateProductQuantity(req, res, next) {
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  if (!productId) {
    next('Please valid Product ID');
    return;
  }


  const productExist = await db.collection('products').findOne({id: productId});
  if (!productExist) {
    next('Product with this id not found in your cart!');
    return;
  }

  await db.collection('users').findOneAndUpdate({id: req.user.id, 'list.id': productId}, {
      $inc: {'list.$.qty': quantity},
    },
  );

  res.json('ok')
}

async function deleteFromMyCart(req, res, next) {
  const productId = req.body.productId;

  const result = await db.collection('users').findOneAndUpdate({id: req.user.id}, {$pull: {list: {id: productId}}});

  if (result.ok === 1) {
    res.json({message: 'Your cart was update!'});
  }

}

async function setProductQuantity(req, res, next) {
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  if (!productId) {
    next('Please valid Product ID');
    return;
  }

  const productExist = await db.collection('products').findOne({id: productId});
  if (!productExist) {
    next('Product with this id not found in your cart!');
    return;
  }

  await db.collection('users').findOneAndUpdate({id: req.user.id, 'list.id': productId}, {
      $set: {'list.$.qty': quantity},
    },
  );

  res.json({ok: true})
}

module.exports = {
  getMyCart,
  addToMyCart,
  updateProductQuantity,
  deleteFromMyCart,
  setProductQuantity,
}
