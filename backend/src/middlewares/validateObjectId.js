const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    return next(new Error('ID no valido'));
  }
  next();
};

module.exports = validateObjectId;
