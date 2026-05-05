const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    ok: false,
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;
