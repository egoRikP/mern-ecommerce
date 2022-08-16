const db = require('../db');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function getUser(req, res) {

  const user = await db.collection('users').findOne({id: req.user.id});

  delete user._id;
  delete user.password;

  return res.json(user);

}

async function loginUser(req, res, next) {
  const {login, password} = req.body;

  const user = await db.collection('users').findOne({login: login});

  if (!user) {
    res.status(422);
    next('User with this login not found!');
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(404);
    next('Invalid login or password!');
    return;
  }

  const token = generateToken(user.id);

  delete user.password;

  res.json({token: token});

}

async function registerUser(req, res, next) {

  const {name, login, password, avatar} = req.body;

  if (!name || !login || !password || !avatar) {
    res.status(400);
    next('Please add all fields!');
    return;
  }

  const userExists = await db.collection('users').findOne({login: login});

  if (userExists) {
    res.status(400);
    next('User already exists!');
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  let user = await db.collection('users').insertOne({
    id: uuid.v4(),
    avatar: req.body.avatar,
    name: req.body.name,
    login: req.body.login,
    password: hashPass,
    purchases: [],
    list: [],
  })

  user = await db.collection('users').findOne({_id: user.insertedId})

  const token = generateToken(user.id);

  res.json({token: token});

}

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
};
