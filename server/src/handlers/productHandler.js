const db = require('../db');

async function getAllInformation(req, res, next) {

  let result = {categories: [], suppliers: []};

  const categories = await db.collection('categories').find({}).toArray();
  if (categories.length) {
    result.categories = categories;
  }

  const suppliers = await db.collection('suppliers').find({}).toArray();
  if (suppliers.length) {
    result.suppliers = suppliers;
  }

  res.json({categories: categories, suppliers: suppliers});

}

async function getProductById(req, res, next) {

  const productId = req.params.productId;
  const product = await db.collection('products').findOne({id: productId});

  return !product ? next(`Product with id ${productId} not found!`) : res.json(product);

}

async function getProductsByParams(req, res, next) {

  let {searchText, categories, suppliers, sortPrice, sortField, sortBy, sortOrder, page} = req.query;

  categories = JSON.parse(categories);
  suppliers = JSON.parse(suppliers);

  if (!page) {
    page = 1;
  }

  if (sortPrice === 'norm') {
    sortPrice = '';
  }

  const itemsPerPage = 9;
  const skipValue = itemsPerPage * (page - 1);

  let query = {};
  let sort = {};

  if (!!searchText) {
    query.name = new RegExp(searchText, 'gmi');
  }

  if (categories.length) {
    query.category = {$in: categories};
  }

  if (suppliers.length) {
    query.suppliers = {$in: suppliers};
  }

  if (!!sortBy) {
    sort._id = sortBy;
  }

  if (!!sortPrice) {
    sort.price = sortPrice;
  }

  if (!!sortField) {
    query.sortField = sortField;
  }
  if (!!sortOrder) {
    query.sortOrder = sortOrder;
  }

  const products = await db.collection('products')
    .find(query)
    .skip(skipValue)
    .limit(itemsPerPage)
    .sort(sort)
    .toArray();

  const totalCount = (await db.collection('products').find(query).toArray()).length;

  if (!products.length) {
    next('0 Products find with filters!');
    return;
  }

  res.json({items: products, itemsPerPage: itemsPerPage, totalCountItems: totalCount});

}

module.exports = {
  getProductById,
  getProductsByParams,
  getAllInformation,
};
