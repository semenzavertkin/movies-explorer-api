const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (imageURL) => validator.isURL(imageURL),
      message: 'Некорректный адрес URL',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (trailerURL) => validator.isURL(trailerURL),
      message: 'Некорректный адрес URL',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (thumbnailURL) => validator.isURL(thumbnailURL),
      message: 'Некорректный адрес URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
