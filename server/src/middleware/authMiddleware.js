const jwt = require('jsonwebtoken');
const db = require('../db');

const protect = (async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    try {
      token = req.headers.authorization.split(' ')[1];

      const decodedData = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await db.collection('users').findOne({'id': decodedData.id});

      next();
    } catch (error) {
      return res.status(401).json({message: 'Not authorized'});
    }
  }

  if (!token) return res.status(401).json({message: 'Not authorized, no token'});
})

module.exports = {protect};
