const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes');
const errorParser = require('./middlewares/errorParser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_DEV_URL, DEV_PORT } = require('./utils/constants');

const PORT = process.env.NODE_ENV === 'production'
  ? process.env.PORT
  : DEV_PORT;

const DB_URL = process.env.NODE_ENV === 'production'
  ? process.env.DB_URL
  : MONGO_DEV_URL;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => console.log('Connected to mongodb'));

const app = express();

const corsOptions = {
  origin: 'https://movies-explorer.pna.nomoredomainsrocks.ru',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(helmet());

app.use(limiter);

app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorParser);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
