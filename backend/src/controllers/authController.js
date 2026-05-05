const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active
});

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Correo y contrasena son obligatorios');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.active) {
      res.status(401);
      throw new Error('Credenciales invalidas');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Credenciales invalidas');
    }

    res.json({
      ok: true,
      message: 'Inicio de sesion correcto',
      token: createToken(user._id),
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  res.json({ ok: true, user: req.user });
};

module.exports = { login, getProfile };
