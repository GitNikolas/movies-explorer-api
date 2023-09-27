const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const errorParser = require('./middlewares/errorParser');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const PORT = process.env.NODE_ENV === 'production'
  ? process.env.PORT
  : '3001';

const DB_URL = process.env.NODE_ENV === 'production'
  ? process.env.DB_URL
  : 'mongodb://localhost:27017/bitfilmsdb';

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => console.log('Connected to mongodb'));

const app = express();

app.use(cors());

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
