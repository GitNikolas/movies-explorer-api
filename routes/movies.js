const router = require('express').Router();
const { checkMovieData, checkMovieId } = require('../utils/validation');

const {
  postMovie,
  getMovies,
  deleteMovieById,
} = require('../controllers/movies');

router.post('', checkMovieData(), postMovie);

router.get('', getMovies);

router.delete('/:movieId', checkMovieId(), deleteMovieById);

module.exports = router;
