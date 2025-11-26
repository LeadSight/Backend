module.exports = (res, message, statusCode = 200, status = 'success', additionalData) => {
  return res.status(statusCode).send({
    status,
    message: message || 'Success',
    data: { ...additionalData }
  })
}