const express = require('express');
const {
  listServices,
  getService,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

const router = express.Router();

router.use(protect);

router.route('/').get(listServices).post(createService);
router
  .route('/:id')
  .get(validateObjectId, getService)
  .put(validateObjectId, updateService)
  .delete(validateObjectId, deleteService);

module.exports = router;
