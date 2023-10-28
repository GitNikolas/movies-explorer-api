const { celebrate, Joi } = require('celebrate');

function checkSignIn() {
  return celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });
}

function checkSignUp() {
  return celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  });
}

function checkMovieData() {
  return celebrate({
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
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required().regex(/^[^а-яё]+$/i),
    }),
  });
}

function checkMovieId() {
  return celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required(),
    }),
  });
}

function checkUserPatch() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
    }),
  });
}

module.exports = {
  checkSignIn,
  checkSignUp,
  checkMovieData,
  checkMovieId,
  checkUserPatch,
};
