const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const AuthError = require('../errors/AuthError');
const NotFound = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');
const BadRequest = require('../errors/BadRequest');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => res.status(201).send({
        email: user.email,
        name: user.name,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequest('Переданы некорректные данные при создании пользователя');
        } else if (err.code === 11000) {
          throw new ConflictError('Пользователь с таким email уже существует');
        } else {
          next(err);
        }
      }));
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new NotFound('Не найдено'); })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Запрашиваемый пользователь не найден');
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => { throw new NotFound('Не найдено'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Ошибка авторизации');
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Ошибка авторизации');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            {
              expiresIn: '7d',
            },
          );
          res.send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  createUser, getUser, updateUser, login,
};
