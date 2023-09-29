const router = require('express').Router();
const consoleLoggerMiddleware = require('../middlewares/consoleLoggerMiddleware');
const auth = require('../middlewares/auth');
const { checkSignIn, checkSignUp } = require('../utils/validation');
const NotFoundError = require('../errors/not-found-error');

router.use(consoleLoggerMiddleware);

const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, postUser, signout } = require('../controllers/users');

router.use('/users', auth, userRouter);

router.use('/movies', auth, movieRouter);

router.post('/signin', checkSignIn(), login);

router.post('/signup', checkSignUp(), postUser);

router.post('/signout', auth, signout);

router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

module.exports = router;
