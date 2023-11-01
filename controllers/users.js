const {
  HTTP_STATUS_CREATED, HTTP_STATUS_OK,
} = require('http2').constants;
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_SECRET_DEV } = require('../utils/constants');

const JWT_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET
  : JWT_SECRET_DEV;

const userModel = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const getUser = (req, res, next) => {
  const { _id } = req.user;
  return userModel.findById(_id)
    .then((response) => {
      res.status(HTTP_STATUS_OK).send(response);
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((userData) => {
      res.status(HTTP_STATUS_CREATED).send({
        name: userData.name,
        about: userData.about,
        avatar: userData.avatar,
        email: userData.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  return userModel.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((response) => res.status(HTTP_STATUS_OK).send(response))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password, (error, isValid) => {
        if (isValid) {
          const token = jwt.sign({ _id: user._id }, JWT_SECRET);
          return res.status(HTTP_STATUS_OK).cookie('authorization', `Bearer ${token}`, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          }).send({ message: 'Куки отправлены' });
        }
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      });
    })
    .catch(next);
};

const signout = (req, res) => {
  res.clearCookie('authorization').send({ message: 'Куки удалены' });
};

module.exports = {
  getUser,
  postUser,
  updateUser,
  login,
  signout,
};
