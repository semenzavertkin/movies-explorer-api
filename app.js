require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');

const { PORT, DB_ADDRESS } = require('./utils/constants');

const router = require('./routes');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

mongoose.connect(DB_ADDRESS, {});

app.use(bodyParser.json());
app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT);
