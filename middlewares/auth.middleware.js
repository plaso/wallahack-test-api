const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports.isAuthenticaded = (req, res, next) => {
  const authorization = req.header('Authorization')
  console.log(authorization);

  if (!authorization) {
    return next(createError(401, 'No auth'));
  }

  const [type, token] = authorization.split(' ');
  console.log({ type, token });

  if (type !== 'Bearer') {
    next(createError(401, 'Bearer error'));
  }

  if (!token) {
    next(createError(401, 'Token error'));
  }

  jwt.verify(token, 'test', (err, decodedToken) => {
    if (err) {
      return next(err)
    } else {
      req.currentUser = decodedToken.id
      next()
    }
  })
}