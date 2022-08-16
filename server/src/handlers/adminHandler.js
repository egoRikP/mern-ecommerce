const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function getAdmin(req,res,next) {
  const user = await db.collection('admins').findOne({id: req.user.id});

  delete user._id;
  delete user.password;

  return res.json(user);
}

async function loginAdmin(req, res, next) {
  const {login, password} = req.body;

  const user = await db.collection('admins').findOne({login: login});
  if (!user) {
    res.status(422);
    next('User with this login not found!')
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(404);
    next('Invalid login or password!')
    return;
  }

  const token = generateToken(user.id);

  delete user.password;

  res.json({token: token});

}


const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}


module.exports = {
  loginAdmin,
  getAdmin,
}