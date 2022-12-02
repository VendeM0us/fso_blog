import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import blogsRouter from './controllers/blogs.js';
import * as config from './utils/config.js';
import * as logger from './utils/logger.js';
import * as middleware from './utils/middleware.js';

const app = express();

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB: ', err.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.resourceNotFound);
app.use(middleware.errorHandler);

export default app;
