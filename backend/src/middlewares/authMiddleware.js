const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Token no enviado');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.active) {
      res.status(401);
      throw new Error('Usuario no autorizado');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Sesion no valida'));
  }
};

module.exports = { protect };
