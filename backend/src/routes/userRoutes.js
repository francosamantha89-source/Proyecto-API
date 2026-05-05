const express = require('express');
const {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

const router = express.Router();

router.use(protect);

router.route('/').get(listUsers).post(createUser);
router.route('/:id').get(validateObjectId, getUser).put(validateObjectId, updateUser).delete(validateObjectId, deleteUser);

module.exports = router;
