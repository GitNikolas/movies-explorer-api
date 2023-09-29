const jwt = require('jsonwebtoken');
const { JWT_SECRET_DEV } = require('../utils/constants');

const JWT_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET
  : JWT_SECRET_DEV;

const UnauthorizedError = require('../errors/unauthorized-error');

function auth(req, res, next) {
  const { authorization } = req.cookies;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Некорректный токен'));
  }

  req.user = payload;

  return next();
}

module.exports = auth;
