const router = require('express').Router();

const {
  validateCreateMovie,
  validationUserId,
} = require('../middlewares/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/_id', validationUserId, deleteMovie);

module.exports = router;
