const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

const errorResponse = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: error.message || 'Something went wrong'
  });
};

module.exports = {
  successResponse,
  errorResponse
};