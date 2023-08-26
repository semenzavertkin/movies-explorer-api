const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFound = require('../errors/NotFound');

const { login, createUser } = require('../controllers/users');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');

const auth = require('../middlewares/auth');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
