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

router.get('/movies', getMovies);
router.post('/movies', validateCreateMovie, createMovie);
router.delete('/movies/_id', validationUserId, deleteMovie);

module.exports = router;
