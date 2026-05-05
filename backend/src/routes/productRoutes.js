const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productStats
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

const router = express.Router();

router.use(protect);

router.get('/stats', productStats);
router.route('/').get(listProducts).post(createProduct);
router
  .route('/:id')
  .get(validateObjectId, getProduct)
  .put(validateObjectId, updateProduct)
  .delete(validateObjectId, deleteProduct);

module.exports = router;
