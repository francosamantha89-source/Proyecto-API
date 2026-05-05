const User = require('../models/User');

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ ok: true, total: users.length, users });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    res.json({ ok: true, user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, active } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409);
      throw new Error('El correo ya existe');
    }

    const user = await User.create({ name, email, password, role, active });
    const response = await User.findById(user._id).select('-password');

    res.status(201).json({ ok: true, message: 'Usuario creado', user: response });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    if (req.body.email && req.body.email !== user.email) {
      const exists = await User.findOne({ email: req.body.email });
      if (exists) {
        res.status(409);
        throw new Error('El correo ya existe');
      }
    }

    const allowedFields = ['name', 'email', 'password', 'role', 'active'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    await user.save();
    const response = await User.findById(user._id).select('-password');

    res.json({ ok: true, message: 'Usuario actualizado', user: response });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    await user.deleteOne();
    res.json({ ok: true, message: 'Usuario eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
