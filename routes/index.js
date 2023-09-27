const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const consoleLoggerMiddleware = require('../middlewares/consoleLoggerMiddleware');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/not-found-error');

router.use(consoleLoggerMiddleware);

const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, postUser, signout } = require('../controllers/users');

router.use('/users', auth, userRouter);

router.use('/movies', auth, movieRouter);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), postUser);

router.post('/signout', signout);

router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

module.exports = router;
