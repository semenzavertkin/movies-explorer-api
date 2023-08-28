const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      throw new NotFound('Не найдено');
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
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => { throw new NotFound('Не найдено'); })
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new Forbidden('В доступе отказано');
      }
      Movie.findByIdAndRemove(req.params._id)
        .orFail(() => { throw new NotFound('Не найдено'); })
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
