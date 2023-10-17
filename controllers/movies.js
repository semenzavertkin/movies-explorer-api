const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((result) => {
      res.send(result);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const movieOwner = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: movieOwner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => { next(new NotFound('Не найдено')); })
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        next(new Forbidden('В доступе отказано'));
      }
      Movie.findByIdAndRemove(req.params._id)
        .orFail(() => { next(new NotFound('Не найдено')); })
        .then(() => res.send({ message: 'Успешно' }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
