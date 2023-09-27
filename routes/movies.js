const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  postMovie,
  getMovies,
  deleteMovieById,
} = require('../controllers/movies');

router.post('', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    // eslint-disable-next-line no-useless-escape
    image: Joi.string().required().regex(/https?:\/\/(www\.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\#?$/i),
    // eslint-disable-next-line no-useless-escape
    trailerLink: Joi.string().required().regex(/https?:\/\/(www\.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\#?$/i),
    // eslint-disable-next-line no-useless-escape
    thumbnail: Joi.string().required().regex(/https?:\/\/(www\.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\#?$/i),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().regex(/^[\W\d]+$/i),
    nameEN: Joi.string().required().regex(/^[^а-яё]+$/i),
  }),
}), postMovie);

router.get('', getMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovieById);

module.exports = router;
