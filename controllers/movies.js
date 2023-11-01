const {
  HTTP_STATUS_CREATED, HTTP_STATUS_OK,
} = require('http2').constants;
require('dotenv').config();

const mongoose = require('mongoose');
const movieModel = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

const postMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const { _id } = req.user;

  return movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: _id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((response) => { res.status(HTTP_STATUS_CREATED).send(response); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

const getMovies = (req, res, next) => {
  const { _id } = req.user;
  movieModel.find({ owner: _id })
    .then((response) => {
      res.status(HTTP_STATUS_OK).send(response);
    })
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  return movieModel.findOne({ movieId })
    .orFail()
    .then((film) => film.deleteOne())
    .then((filmData) => res.status(HTTP_STATUS_OK).send(filmData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный id: ${movieId}`));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Фильм с указанным id не найден: ${movieId}`));
      }
      return next(err);
    });
};

module.exports = {
  postMovie,
  getMovies,
  deleteMovieById,
};
